'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

const AccessPage = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleAccess = async () => {
    const response = await fetch('/api/dhis/medical-record');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setFileUrl(url);
  };

  return (
    <div>
      <h1>Access Medical Records</h1>
      <Button onClick={handleAccess}>Access</Button>
      {fileUrl && (
        <iframe
          src={fileUrl}
          width="100%"
          height="800px"
          title="Decrypted PDF"
        />
      )}
    </div>
  );
};

export default AccessPage;
