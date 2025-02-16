// src/components/ui/QRCode.tsx
import React from 'react';
import { QRCode as QRCodeLib } from 'qrcode.react';

type QRCodeProps = {
  value: string;
};

const QRCode: React.FC<QRCodeProps> = ({ value }) => {
  return <QRCodeLib value={value} />;
};

export default QRCode;
