'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Define the Color type
interface Color {
  hex: string;
  color: string;
  fakeImg: string;
}

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  img: string;
  img1: string;
  colors: Color[];
  size: string[];
  brand: string;
}

interface ProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [newCategory, setNewCategory] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({
    hex: '#000000',
    color: '',
    fakeImg: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'price') {
      setFormData({ ...formData, [name]: Number.parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      const categories = formData.category.split(' ');
      if (!categories.includes(newCategory.trim())) {
        setFormData({
          ...formData,
          category: formData.category
            ? `${formData.category} ${newCategory.trim()}`
            : newCategory.trim(),
        });
      }
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const categories = formData.category
      .split(' ')
      .filter((cat) => cat !== categoryToRemove);
    setFormData({
      ...formData,
      category: categories.join(' '),
    });
  };

  const addSize = () => {
    if (newSize.trim() && !formData.size.includes(newSize.trim())) {
      setFormData({
        ...formData,
        size: [...formData.size, newSize.trim()],
      });
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData({
      ...formData,
      size: formData.size.filter((s) => s !== sizeToRemove),
    });
  };

  const addColor = () => {
    if (newColor.color.trim() && newColor.hex) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { ...newColor }],
      });
      setNewColor({ hex: '#000000', color: '', fakeImg: '' });
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({
      ...formData,
      colors: updatedColors,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='id'>ID</Label>
            <Input
              id='id'
              name='id'
              value={formData.id}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <div>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='price'>Price</Label>
            <Input
              id='price'
              name='price'
              type='number'
              step='0.01'
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='brand'>Brand</Label>
            <Input
              id='brand'
              name='brand'
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='img'>Main Image URL</Label>
            <Input
              id='img'
              name='img'
              value={formData.img}
              onChange={handleInputChange}
              required
            />
            {formData.img && (
              <div className='mt-2 relative h-32 w-32'>
                <Image
                  src={formData.img || '/placeholder.svg'}
                  alt='Main product image'
                  fill
                  className='object-cover rounded-md'
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='img1'>Secondary Image URL</Label>
            <Input
              id='img1'
              name='img1'
              value={formData.img1}
              onChange={handleInputChange}
              required
            />
            {formData.img1 && (
              <div className='mt-2 relative h-32 w-32'>
                <Image
                  src={formData.img1 || '/placeholder.svg'}
                  alt='Secondary product image'
                  fill
                  className='object-cover rounded-md'
                />
              </div>
            )}
          </div>

          <div>
            <Label>Categories</Label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {formData.category.split(' ').map((cat, i) => (
                <Badge
                  key={i}
                  variant='outline'
                  className='flex items-center gap-1'
                >
                  {cat}
                  <button
                    type='button'
                    onClick={() => removeCategory(cat)}
                    className='text-muted-foreground hover:text-foreground'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
            <div className='flex gap-2'>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder='Add category'
              />
              <Button type='button' size='sm' onClick={addCategory}>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <Label>Sizes</Label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {formData.size.map((s, i) => (
                <Badge
                  key={i}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {s}
                  <button
                    type='button'
                    onClick={() => removeSize(s)}
                    className='text-muted-foreground hover:text-foreground'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
            <div className='flex gap-2'>
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder='Add size'
              />
              <Button type='button' size='sm' onClick={addSize}>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <Label>Colors</Label>
            <div className='grid grid-cols-2 gap-2 mb-2'>
              {formData.colors.map((color, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2 border rounded-md p-2'
                >
                  <div
                    className='w-6 h-6 rounded-full border'
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className='text-sm flex-grow'>{color.color}</span>
                  <button
                    type='button'
                    onClick={() => removeColor(i)}
                    className='text-muted-foreground hover:text-destructive'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <Input
                type='color'
                value={newColor.hex}
                onChange={(e) =>
                  setNewColor({ ...newColor, hex: e.target.value })
                }
                className='w-full h-10'
              />
              <Input
                value={newColor.color}
                onChange={(e) =>
                  setNewColor({ ...newColor, color: e.target.value })
                }
                placeholder='Color name'
              />
              <Button type='button' onClick={addColor}>
                Add Color
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit'>Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
