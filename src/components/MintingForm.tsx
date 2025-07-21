'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MintingForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    royalty: "5",
    collection: "",
  });
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsUploading(false);
        toast({
          title: "File uploaded successfully",
          description: "Your artwork has been uploaded and is ready for minting.",
        });
      }, 2000);
    }
  };

  const handleMint = async () => {
    if (!previewUrl || !formData.name || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      toast({
        title: "NFT Minted Successfully!",
        description: "Your NFT has been minted and added to your collection.",
      });
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        royalty: "5",
        collection: "",
      });
      setPreviewUrl("");
    }, 3000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="file-upload" className="text-base font-medium">
            Upload Artwork *
          </Label>
          <div className="mt-2">
            {previewUrl ? (
              <Card>
                <CardContent className="p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => setPreviewUrl("")}
                  >
                    Remove Image
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 100MB
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Card */}
        {previewUrl && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{formData.name || "Untitled"}</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.description || "No description"}
                </p>
                <div className="flex gap-2">
                  {formData.category && (
                    <Badge variant="secondary">{formData.category}</Badge>
                  )}
                  <Badge variant="outline">{formData.royalty}% Royalty</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter NFT name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your NFT"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="royalty">Royalty Percentage</Label>
            <Select
              value={formData.royalty}
              onValueChange={(value) => setFormData({ ...formData, royalty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="2.5">2.5%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="7.5">7.5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="collection">Collection (Optional)</Label>
            <Input
              id="collection"
              placeholder="Add to collection"
              value={formData.collection}
              onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
            />
          </div>
        </div>

        <Button
          onClick={handleMint}
          disabled={!previewUrl || !formData.name || !formData.description || isMinting}
          className="w-full"
          size="lg"
        >
          {isMinting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Minting NFT...
            </>
          ) : (
            "Mint NFT"
          )}
        </Button>
      </div>
    </div>
  );
};