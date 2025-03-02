'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Plus, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HexColorPicker } from '@/components/HexColorPicker';
import { uploadImageInImgBb } from '@/lib/uploadImage';

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const categories = ['newrelease', 'women', 'men', 'boundel', 'frontpage'];

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      category: [],
      sizes: [],
      colors: [],
    },
    resolver: (values) => {
      const errors = {};

      if (!values.title) {
        errors.title = { message: 'Product title is required' };
      }

      if (!values.price) {
        errors.price = { message: 'Price is required' };
      }

      if (!values.description) {
        errors.description = { message: 'Description is required' };
      }

      if (!values.category || values.category.length === 0) {
        errors.category = { message: 'Please select at least one category' };
      }

      if (!values.sizes || values.sizes.length === 0) {
        errors.sizes = { message: 'Please select at least one size' };
      }

      if (!values.colors || values.colors.length === 0) {
        errors.colors = { message: 'Please add at least one color' };
      }

      return {
        values,
        errors,
      };
    },
  });

  const [mainImage, setMainImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState({
    hex: '#000000',
    name: '',
    image: null,
    imagePreview: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const watchedColors = watch('colors') || [];

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(URL.createObjectURL(file));
      setValue('img', file);
    }
  };

  const handleSecondaryImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecondaryImage(URL.createObjectURL(file));
      setValue('img1', file);
    }
  };

  const addColor = () => {
    if (currentColor.name.trim() === '') return;

    const newColor = {
      hex: currentColor.hex,
      color: currentColor.name,
      fakeImg: `https://via.placeholder.com/100/${currentColor.hex.replace(
        '#',
        ''
      )}`,
    };

    setValue('colors', [...watchedColors, newColor]);
    setCurrentColor({ hex: '#000000', name: '' });
    setColorPickerOpen(false);
  };

  const removeColor = (index) => {
    const updatedColors = [...watchedColors];
    updatedColors.splice(index, 1);
    setValue('colors', updatedColors);
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    if (watchedColors.length === 0) {
      setError('colors', {
        type: 'manual',
        message: 'Please add at least one color',
      });
      setIsUploading(false);
      return;
    }

    // In a real app, you would upload images to a server here
    // For this example, we'll simulate the upload process

    try {
      // First, upload the main product images
      const mainImageUrl = await uploadImageInImgBb(data.img);

      console.log(mainImageUrl, 'mainImageUrl');

      const secondaryImageUrl =
        secondaryImage || '/placeholder.svg?height=400&width=400';

      // Then, upload each color image and update the URLs
      const processedColors = await Promise.all(
        watchedColors.map(async (color) => {
          // In a real app, you would upload the image file here
          // For this example, we'll just use the preview URL
          return {
            hex: color.hex,
            color: color.color,
            fakeImg: color.fakeImg,
          };
        })
      );

      const formattedData = {
        title: data.title,
        price: Number.parseFloat(data.price),
        description: data.description,
        category: data.category.join(' '),
        img: mainImageUrl,
        img1: secondaryImageUrl,
        colors: JSON.stringify(processedColors),
        size: JSON.stringify(data.sizes),
      };
      console.log(formattedData, 'formattedData');
    } catch (error) {
      console.error('Error processing product:', error);
      alert('An error occurred while adding the product');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className='max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Fill in the details to add a new product to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Image Upload Section */}
            <div className='space-y-4'>
              <div>
                <Label htmlFor='mainImage'>Main Product Image</Label>
                <div className='mt-2'>
                  {mainImage ? (
                    <div className='relative aspect-square'>
                      <img
                        src={mainImage || '/placeholder.svg'}
                        alt='Main product'
                        className='w-full h-full object-cover rounded-md border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          setMainImage(null);
                          setValue('img', null);
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <Label
                      htmlFor='mainImage'
                      className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50'
                    >
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Upload className='h-10 w-10 text-muted-foreground mb-2' />
                        <p className='text-sm text-muted-foreground'>
                          Click to upload main image
                        </p>
                      </div>
                      <input
                        id='mainImage'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleMainImageChange}
                      />
                    </Label>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor='secondaryImage'>Secondary Product Image</Label>
                <div className='mt-2'>
                  {secondaryImage ? (
                    <div className='relative aspect-square'>
                      <img
                        src={secondaryImage || '/placeholder.svg'}
                        alt='Secondary product'
                        className='w-full h-full object-cover rounded-md border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          setSecondaryImage(null);
                          setValue('img1', null);
                        }}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <Label
                      htmlFor='secondaryImage'
                      className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50'
                    >
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Upload className='h-10 w-10 text-muted-foreground mb-2' />
                        <p className='text-sm text-muted-foreground'>
                          Click to upload secondary image
                        </p>
                      </div>
                      <input
                        id='secondaryImage'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleSecondaryImageChange}
                      />
                    </Label>
                  )}
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              {/* Product Title */}
              <div className='space-y-2'>
                <Label htmlFor='title'>Product Title</Label>
                <Input
                  id='title'
                  {...register('title', {
                    required: 'Product title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters',
                    },
                  })}
                />
                {errors.title && (
                  <p className='text-sm text-destructive'>
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Product Price */}
              <div className='space-y-2'>
                <Label htmlFor='price'>Price ($)</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...register('price', {
                    required: 'Price is required',
                    min: {
                      value: 0.01,
                      message: 'Price must be greater than 0',
                    },
                  })}
                />
                {errors.price && (
                  <p className='text-sm text-destructive'>
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Product Description */}
              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  rows={4}
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description must be at least 20 characters',
                    },
                  })}
                />
                {errors.description && (
                  <p className='text-sm text-destructive'>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className='space-y-2'>
            <Label>Categories</Label>
            <div className='flex flex-wrap gap-2'>
              <Controller
                name='category'
                control={control}
                rules={{ required: 'Select at least one category' }}
                render={({ field }) => (
                  <>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={field.value.includes(category)}
                          onCheckedChange={(checked) => {
                            const updatedCategories = checked
                              ? [...field.value, category]
                              : field.value.filter((c) => c !== category);
                            field.onChange(updatedCategories);
                          }}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className='text-sm'
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              />
              {errors.category && (
                <p className='text-sm text-destructive w-full'>
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className='space-y-2'>
            <Label>Available Sizes</Label>
            <div className='flex flex-wrap gap-2'>
              <Controller
                name='sizes'
                control={control}
                rules={{ required: 'Select at least one size' }}
                render={({ field }) => (
                  <>
                    {availableSizes.map((size) => (
                      <div key={size} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`size-${size}`}
                          checked={field.value.includes(size)}
                          onCheckedChange={(checked) => {
                            const updatedSizes = checked
                              ? [...field.value, size]
                              : field.value.filter((s) => s !== size);
                            field.onChange(updatedSizes);
                          }}
                        />
                        <Label htmlFor={`size-${size}`} className='text-sm'>
                          {size}
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              />
              {errors.sizes && (
                <p className='text-sm text-destructive w-full'>
                  {errors.sizes.message}
                </p>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <Label>Product Colors</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setColorPickerOpen(true)}
              >
                <Plus className='h-4 w-4 mr-1' /> Add Color
              </Button>
            </div>

            {colorPickerOpen && (
              <div className='p-4 border rounded-md space-y-4'>
                <HexColorPicker
                  color={currentColor.hex}
                  onChange={(color) =>
                    setCurrentColor({ ...currentColor, hex: color })
                  }
                />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='colorName'>Color Name</Label>
                    <Input
                      id='colorName'
                      placeholder='e.g. Red, Blue, Black'
                      value={currentColor.name}
                      onChange={(e) =>
                        setCurrentColor({
                          ...currentColor,
                          name: e.target.value,
                        })
                      }
                      className='mt-1'
                    />
                  </div>
                  <div>
                    <Label htmlFor='colorImage'>Color Image</Label>
                    <div className='mt-1'>
                      {currentColor.imagePreview ? (
                        <div className='relative h-48 w-48'>
                          <img
                            src={
                              currentColor.imagePreview || '/placeholder.svg'
                            }
                            alt='Color preview'
                            className='h-full w-full object-cover rounded-md border'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute -top-2 -right-2 h-6 w-6'
                            onClick={() =>
                              setCurrentColor({
                                ...currentColor,
                                image: null,
                                imagePreview: null,
                              })
                            }
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ) : (
                        <Label
                          htmlFor='colorImage'
                          className='flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50'
                        >
                          <Upload className='h-6 w-6 text-muted-foreground' />
                          <input
                            id='colorImage'
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setCurrentColor({
                                  ...currentColor,
                                  image: file,
                                  imagePreview: URL.createObjectURL(file),
                                });
                              }
                            }}
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 justify-end'>
                  <Button
                    type='button'
                    onClick={() => {
                      if (!currentColor.name.trim()) {
                        alert('Please enter a color name');
                        return;
                      }
                      if (!currentColor.imagePreview) {
                        alert('Please upload an image for this color');
                        return;
                      }

                      const newColor = {
                        hex: currentColor.hex,
                        color: currentColor.name,
                        fakeImg: currentColor.imagePreview,
                        image: currentColor.image,
                      };

                      setValue('colors', [...watchedColors, newColor]);
                      setCurrentColor({
                        hex: '#000000',
                        name: '',
                        image: null,
                        imagePreview: null,
                      });
                      setColorPickerOpen(false);
                    }}
                  >
                    Add Color
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setCurrentColor({
                        hex: '#000000',
                        name: '',
                        image: null,
                        imagePreview: null,
                      });
                      setColorPickerOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
              {watchedColors.map((color, index) => (
                <div
                  key={index}
                  className='flex items-center p-3 border rounded-md'
                >
                  <div className='flex items-center space-x-2 flex-1'>
                    <div
                      className='w-8 h-8 rounded-full border'
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {color.color}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {color.hex}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='h-10 w-10 relative'>
                      <img
                        src={color.fakeImg || '/placeholder.svg'}
                        alt={`${color.color} preview`}
                        className='h-full w-full object-cover rounded-md'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeColor(index)}
                      className='h-8 w-8'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {errors.colors && (
              <p className='text-sm text-destructive'>
                {errors.colors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isUploading || !mainImage || !secondaryImage}
            className='w-full'
          >
            {isUploading ? 'Uploading...' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
