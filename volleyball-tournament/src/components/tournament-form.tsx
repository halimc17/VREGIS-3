'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Tournament {
  id: string;
  name: string;
  category: 'putra' | 'putri' | 'mixed';
  status: 'open' | 'closed';
  location: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxPlayersPerTeam: number;
  poolsPutra: number;
  poolsPutri: number;
}

interface TournamentFormProps {
  tournament?: Tournament | null;
  mode: 'create' | 'edit';
  onSaved: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  category: 'putra' | 'putri' | 'mixed' | '';
  status: 'open' | 'closed';
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxPlayersPerTeam: number;
  poolsPutra: number;
  poolsPutri: number;
}

export function TournamentForm({ tournament, mode, onSaved, onCancel }: TournamentFormProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (tournament && mode === 'edit') {
      return {
        name: tournament.name,
        category: tournament.category,
        status: tournament.status,
        location: tournament.location,
        description: tournament.description || '',
        startDate: new Date(tournament.startDate).toISOString().slice(0, 10),
        endDate: new Date(tournament.endDate).toISOString().slice(0, 10),
        registrationDeadline: new Date(tournament.registrationDeadline).toISOString().slice(0, 10),
        maxPlayersPerTeam: tournament.maxPlayersPerTeam,
        poolsPutra: tournament.poolsPutra,
        poolsPutri: tournament.poolsPutri,
      };
    }
    return {
      name: '',
      category: '',
      status: 'open',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      maxPlayersPerTeam: 14,
      poolsPutra: 0,
      poolsPutri: 0,
    };
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.registrationDeadline && formData.startDate && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date';
    }

    if (formData.maxPlayersPerTeam < 1) {
      newErrors.maxPlayersPerTeam = 'Max players per team must be at least 1';
    }

    if (formData.poolsPutra < 0) {
      newErrors.poolsPutra = 'Number of pools cannot be negative';
    }

    if (formData.poolsPutri < 0) {
      newErrors.poolsPutri = 'Number of pools cannot be negative';
    }

    // Validate pools based on category
    if (formData.category === 'putra' && formData.poolsPutra === 0) {
      newErrors.poolsPutra = 'Putra category requires at least 1 pool';
    }

    if (formData.category === 'putri' && formData.poolsPutri === 0) {
      newErrors.poolsPutri = 'Putri category requires at least 1 pool';
    }

    if (formData.category === 'mixed' && formData.poolsPutra === 0 && formData.poolsPutri === 0) {
      newErrors.poolsPutra = 'Mixed category requires at least 1 pool for putra or putri';
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
      const submitData = {
        ...formData,
        category: formData.category as 'putra' | 'putri' | 'mixed',
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
      };

      const url = mode === 'create' ? '/api/tournaments' : `/api/tournaments/${tournament?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Show success toast
        toast.success(
          mode === 'create'
            ? 'Tournament created successfully!'
            : 'Tournament updated successfully!'
        );

        onSaved();
        // Reset form for create mode
        if (mode === 'create') {
          setFormData({
            name: '',
            category: '',
            status: 'open',
            location: '',
            description: '',
            startDate: '',
            endDate: '',
            registrationDeadline: '',
            maxPlayersPerTeam: 14,
            poolsPutra: 0,
            poolsPutri: 0,
          });
        }
      } else {
        const error = await response.json();

        // Show error toast
        const errorMessage = typeof error.error === 'string'
          ? error.error
          : 'Failed to save tournament. Please check the form and try again.';
        toast.error(errorMessage);

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
      console.error('Error saving tournament:', error);
      toast.error('Network error. Please check your connection and try again.');
      setErrors({ general: 'Failed to save tournament' });
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter tournament name"
              />
              {errors.name && (
                <div className="text-sm text-destructive">{errors.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value: 'putra' | 'putri' | 'mixed') => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="putra">Putra</SelectItem>
                  <SelectItem value="putri">Putri</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <div className="text-sm text-destructive">{errors.category}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'open' | 'closed') => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <div className="text-sm text-destructive">{errors.status}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter tournament location"
              />
              {errors.location && (
                <div className="text-sm text-destructive">{errors.location}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter tournament description"
              rows={3}
            />
            {errors.description && (
              <div className="text-sm text-destructive">{errors.description}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
              {errors.startDate && (
                <div className="text-sm text-destructive">{errors.startDate}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
              {errors.endDate && (
                <div className="text-sm text-destructive">{errors.endDate}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
              <Input
                id="registrationDeadline"
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
              />
              {errors.registrationDeadline && (
                <div className="text-sm text-destructive">{errors.registrationDeadline}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPlayersPerTeam">Max Players per Team</Label>
              <Input
                id="maxPlayersPerTeam"
                type="number"
                min="1"
                value={formData.maxPlayersPerTeam}
                onChange={(e) => handleInputChange('maxPlayersPerTeam', parseInt(e.target.value) || 0)}
              />
              {errors.maxPlayersPerTeam && (
                <div className="text-sm text-destructive">{errors.maxPlayersPerTeam}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolsPutra">Number of Pools (Putra)</Label>
              <Input
                id="poolsPutra"
                type="number"
                min="0"
                value={formData.poolsPutra}
                onChange={(e) => handleInputChange('poolsPutra', parseInt(e.target.value) || 0)}
              />
              {errors.poolsPutra && (
                <div className="text-sm text-destructive">{errors.poolsPutra}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolsPutri">Number of Pools (Putri)</Label>
              <Input
                id="poolsPutri"
                type="number"
                min="0"
                value={formData.poolsPutri}
                onChange={(e) => handleInputChange('poolsPutri', parseInt(e.target.value) || 0)}
              />
              {errors.poolsPutri && (
                <div className="text-sm text-destructive">{errors.poolsPutri}</div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create Tournament'
                  : 'Update Tournament'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}