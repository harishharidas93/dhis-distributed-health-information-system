const generateChecksum = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

export default {
  generateChecksum,
};
