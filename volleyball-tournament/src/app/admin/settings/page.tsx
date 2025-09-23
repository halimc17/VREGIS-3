import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Database, Bell } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const settingsItems = [
    {
      title: 'User Management',
      description: 'Manage system users, roles, and permissions',
      icon: Users,
      href: '/admin/settings/users',
      color: 'text-blue-600',
    },
    {
      title: 'Security Settings',
      description: 'Configure authentication and security policies',
      icon: Shield,
      href: '/admin/settings/security',
      color: 'text-red-600',
      disabled: true,
    },
    {
      title: 'Database',
      description: 'Database backup, restore, and maintenance',
      icon: Database,
      href: '/admin/settings/database',
      color: 'text-green-600',
      disabled: true,
    },
    {
      title: 'Notifications',
      description: 'Email and system notification preferences',
      icon: Bell,
      href: '/admin/settings/notifications',
      color: 'text-yellow-600',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsItems.map((item) => (
          <Card key={item.title} className={item.disabled ? 'opacity-50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.disabled ? (
                <Button disabled variant="outline" className="w-full">
                  Coming Soon
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.href}>
                    Configure
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}