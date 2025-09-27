'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'administrator';
}

interface UserFormProps {
  user?: User | null;
  mode: 'create' | 'edit';
  onSaved: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'administrator';
}

export function UserForm({ user, mode, onSaved, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        password: '', // Don't pre-fill password for security
        confirmPassword: '', // Don't pre-fill password confirmation
        role: user.role,
      });
    }
  }, [user, mode]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Password confirmation validation
    if (mode === 'create' && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // For edit mode, if password is provided, confirmation is required
    if (mode === 'edit' && formData.password && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required when changing password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }

      const url = mode === 'create' ? '/api/users' : `/api/users/${user?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        onSaved();
        // Reset form for create mode
        if (mode === 'create') {
          setFormData({
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user',
          });
        }
      } else {
        const error = await response.json();
        if (typeof error.error === 'string') {
          setErrors({ general: error.error });
        } else if (Array.isArray(error.error)) {
          // Handle Zod validation errors
          const newErrors: Record<string, string> = {};
          error.error.forEach((err: any) => {
            if (err.path && err.path[0]) {
              newErrors[err.path[0]] = err.message;
            }
          });
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ general: 'Failed to save user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
            />
            {errors.name && (
              <div className="text-sm text-destructive">{errors.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter username"
            />
            {errors.username && (
              <div className="text-sm text-destructive">{errors.username}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="text-sm text-destructive">{errors.email}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {mode === 'edit' && '(leave empty to keep current password)'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password (optional)'}
            />
            {errors.password && (
              <div className="text-sm text-destructive">{errors.password}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder={mode === 'create' ? 'Confirm your password' : 'Confirm new password'}
            />
            {errors.confirmPassword && (
              <div className="text-sm text-destructive">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: 'user' | 'administrator') => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <div className="text-sm text-destructive">{errors.role}</div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}