
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Copy, Check } from "lucide-react";

const OGTester: React.FC = () => {
  const [url, setUrl] = useState('https://www.musicgift.ro');
  const [copied, setCopied] = useState(false);
  
  const socialDebuggers = [
    {
      name: 'Facebook Sharing Debugger',
      url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`,
      description: 'Test how your page appears on Facebook'
    },
    {
      name: 'Twitter Card Validator',
      url: `https://cards-dev.twitter.com/validator`,
      description: 'Validate Twitter cards (paste URL manually)'
    },
    {
      name: 'LinkedIn Post Inspector',
      url: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`,
      description: 'Test how your page appears on LinkedIn'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentImageUrl = 'https://www.musicgift.ro/uploads/logo_musicgift.webp';

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Graph Testing Tool</CardTitle>
            <CardDescription>
              Test your Open Graph image and meta tags across social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-url">URL to Test</Label>
              <div className="flex gap-2">
                <Input
                  id="test-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.musicgift.ro"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(url)}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current OG Image</Label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <code className="text-sm flex-1">{currentImageUrl}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentImageUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          {socialDebuggers.map((debugger, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{debugger.name}</CardTitle>
                <CardDescription>{debugger.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => window.open(debugger.url, '_blank')}
                  className="w-full flex items-center gap-2"
                >
                  Test on {debugger.name.split(' ')[0]}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Testing Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>First, verify the image loads directly by clicking the image URL above</li>
              <li>Use Facebook Sharing Debugger to see how Facebook sees your page</li>
              <li>Click "Scrape Again" in Facebook debugger to clear cache</li>
              <li>Test with Twitter Card Validator (paste URL manually)</li>
              <li>Check LinkedIn Post Inspector for LinkedIn preview</li>
              <li>If issues persist, check browser console for any errors</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Meta Tags Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded text-sm font-mono space-y-1">
              <div>&lt;meta property="og:image" content="{currentImageUrl}" /&gt;</div>
              <div>&lt;meta property="og:image:width" content="1200" /&gt;</div>
              <div>&lt;meta property="og:image:height" content="630" /&gt;</div>
              <div>&lt;meta property="og:title" content="MusicGift.ro - Cadouri Muzicale Personalizate" /&gt;</div>
              <div>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</div>
              <div>&lt;meta name="twitter:image" content="{currentImageUrl}" /&gt;</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OGTester;
