// components/profile/AnonymousSettings.tsx

import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnonymousSettingsProps } from "@/types";

export function AnonymousSettings({ 
  anonymousGlobal, 
  onToggleAnonymous 
}: AnonymousSettingsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {anonymousGlobal ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
          Privacy Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Global Anonymous Mode</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>When enabled:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All new reviews will be anonymous by default</li>
                <li>Your identity will be hidden in public review listings</li>
                <li>Only you and admins can see your real identity</li>
                <li>You can still choose to post publicly on individual reviews</li>
              </ul>
            </div>
          </div>
          <Switch
            checked={anonymousGlobal}
            onCheckedChange={onToggleAnonymous}
            className="ml-4"
          />
        </div>

        {anonymousGlobal && (
          <Alert>
            <AlertDescription>
              Your future reviews will be anonymous by default. You can still choose to post publicly when creating individual reviews.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}