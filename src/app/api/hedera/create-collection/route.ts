/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import mirrorNode from '@/utils/mirrorNode';
import { TokenType, PrivateKey, TokenMintTransaction, TransactionId, Timestamp, NftId, PublicKey, AccountId, TokenId, TokenCreateTransaction, TransferTransaction, TokenBurnTransaction, TokenWipeTransaction, TokenDeleteTransaction, TokenPauseTransaction, TokenUnpauseTransaction, TokenFreezeTransaction, TokenUnfreezeTransaction, TokenGrantKycTransaction, TokenRevokeKycTransaction, TokenAssociateTransaction, TokenDissociateTransaction, AccountAllowanceApproveTransaction, AccountAllowanceDeleteTransaction, TokenSupplyType } from '@hashgraph/sdk';
const httpStatus = require('http-status');

const keys = [
  'adminKey',
  'supplyKey',
  'newSupplyKey',
  'enableInvalidateCertFeature',
  'enableFreezeUserFeature',
  'enablePauseFeature',
  'enableKycFeature',
];

export async function GET(request: NextRequest) {
  try {
    
    console.log("Fetching Hedera NFTs...", request);
    return NextResponse.json({
      success: true,
      data: [],
      chain: 'Hedera'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFTs',
        data: []
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json(); 
    const symbol = payload.name;
    const initialSupply = 0;
    const tokenType = TokenType.NonFungibleUnique;

    const collectionValidKeys: any = {};
    const privateKeys: any = {};

    const pubKey = await mirrorNode.fetchAccountInfo(payload.walletAddress);
    if (!pubKey.key?.key) {
    return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server error, not able to get public key from account details',
    };
    }
    const accountKey = PublicKey.fromString(pubKey.key.key);
    keys.forEach((key) => {
        privateKeys[key] = {
            publicKey: accountKey,
            pvtKeyString: accountKey.toStringRaw(),
        };
    });

    const ninetyDaysSeconds = 60 * 60 * 24 * 90;
    const secondsNow = Math.round(Date.now() / 1000);
    const timestamp = secondsNow + ninetyDaysSeconds;
    const timestampObj = new Timestamp(timestamp, 0);
    const tokenCreate = new TokenCreateTransaction();
    const memo = payload.description ? payload.description.substring(0, 100) : `${payload.name} by ${payload.walletAddress}`;
    tokenCreate
        .setMaxTransactionFee(30)
        .setTokenName(payload.name)
        .setTokenSymbol(symbol)
        .setTokenType(tokenType)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(payload.walletAddress)
        .setTokenMemo(memo)
        .setSupplyKey(privateKeys.supplyKey.publicKey)
        .setExpirationTime(timestampObj);

    collectionValidKeys.supplyKey = privateKeys.supplyKey.pvtKeyString;
    collectionValidKeys.newSupplyKey = privateKeys.newSupplyKey.pvtKeyString;

    tokenCreate.setWipeKey(privateKeys.enableInvalidateCertFeature.publicKey);
    tokenCreate.setAdminKey(privateKeys.adminKey.publicKey);
    tokenCreate.setKycKey(privateKeys.enableKycFeature.publicKey);
    tokenCreate.setFreezeKey(privateKeys.enableFreezeUserFeature.publicKey);
    tokenCreate.setPauseKey(privateKeys.enablePauseFeature.publicKey);

    const transId = TransactionId.generate(payload.walletAddress);
    tokenCreate.setTransactionId(transId);
    tokenCreate.setNodeAccountIds([new AccountId(3)]);
    tokenCreate.freeze();
    return {
        status: 'success',
        transaction: tokenCreate.toBytes(),
    };
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Failed to fetch Hedera NFTs',
        data: []
      },
      { status: 500 }
    );
  }
}