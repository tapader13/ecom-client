'use client';

type ProductFormValues = {
  title: string;
  price: string;
  description: string;
  brand: string;
  category: string | string[];
  sizes: string[];
  colors: {
    hex: string;
    color: string;
    fakeImg?: string;
    image?: File | null;
  }[];
  img?: File | null;
  img1?: File | null;
};

interface Color {
  hex: string;
  color: string;
  fakeImg: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string | string[];
  img: string;
  img1: string;
  colors: Color[];
  size: string[];
  brand: string;
}

interface ProductFormProps {
  product: Product;
  // onSave: (product: Product) => void;
  onCancel: () => void;
}
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Plus, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HexColorPicker } from '@/components/HexColorPicker';
import { uploadImageInImgBb } from '@/lib/uploadImage';
import { supabase } from '@/lib/supabase/product';
import { useAppSelector } from '@/lib/redux/hooks';
import { getUser } from '@/lib/redux/user/userSlice';
import { redirect } from 'next/navigation';

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const categories = [
  'newrelease',
  'women',
  'men',
  'boundel',
  'frontpage',
  'shirt',
  'jeans',
  'pants',
  'shorts',
  'cargo',
  'beggi',
];

export default function ProductForm({
  product,
  // onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      brand: '',
      category: [],
      sizes: [],
      colors: [],
    },
    resolver: (values) => {
      const errors: Record<string, { message: string }> = {};

      if (!values.title) {
        errors.title = { message: 'Product title is required' };
      }

      if (!values.price) {
        errors.price = { message: 'Price is required' };
      }

      if (!values.description) {
        errors.description = { message: 'Description is required' };
      }
      if (!values.brand) {
        errors.brand = { message: 'Brand is required' };
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
  console.log('Product Category:', product.category);
  console.log('Type of Product Category:', typeof product.category);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isMainImageChanged, setIsMainImageChanged] = useState(false);
  const [isSecondaryImageChanged, setIsSecondaryImageChanged] = useState(false);
  // const [currentColor, setCurrentColor] = useState({
  //   hex: '#000000',
  //   name: '',
  //   image: null,
  //   imagePreview: null,
  // });
  const [currentColor, setCurrentColor] = useState<{
    hex: string;
    name: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    hex: '#000000',
    name: '',
    image: null,
    imagePreview: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const watchedColors = watch('colors') || [];
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        brand: product.brand,
        category: Array.isArray(product.category)
          ? product.category
          : product.category.split(' ').filter(Boolean),
        sizes: product.size || [],
        colors: product.colors || [],
      });

      setMainImage(product.img);
      setSecondaryImage(product.img1);
      // (product.colors || []);
    }
  }, [product, reset]);

  const handleMainImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(URL.createObjectURL(file));
      setIsMainImageChanged(true);
      setValue('img', file);
    }
  };

  const handleSecondaryImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecondaryImage(URL.createObjectURL(file));
      setIsSecondaryImageChanged(true);
      setValue('img1', file);
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = [...watchedColors];
    updatedColors.splice(index, 1);
    setValue('colors', updatedColors);
  };

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    if (watchedColors.length === 0) {
      setError('colors', {
        type: 'manual',
        message: 'Please add at least one color',
      });
      setIsUploading(false);
      return;
    }
    // if (!Array.isArray(data.category)) {
    //   console.error('data.category is not an array:', data.category);
    //   setIsUploading(false);
    //   return;
    // }
    try {
      // First, upload the main product images
      // const mainImageUrl = await uploadImageInImgBb(data.img);
      let mainImageUrl = product?.img || '';
      if (isMainImageChanged && data.img) {
        mainImageUrl = await uploadImageInImgBb(data.img);
      }
      console.log(mainImageUrl, 'mainImageUrl');
      //TODO: secure this page using middleware
      // const secondaryImageUrl = await uploadImageInImgBb(data.img1);
      let secondaryImageUrl = product?.img1 || '';
      if (isSecondaryImageChanged && data.img1) {
        secondaryImageUrl = await uploadImageInImgBb(data.img1);
      }
      // Then, upload each color image and update the URLs
      const processedColors = await Promise.all(
        watchedColors.map(async (color) => {
          if (!color.image && color.fakeImg) {
            return {
              hex: color.hex,
              color: color.color,
              fakeImg: color.fakeImg, // Reuse the existing image URL
            };
          }
          if (color.image) {
            console.log(color, 'color.image');
            const fakeImageUrl = await uploadImageInImgBb(color.image);
            return {
              hex: color.hex,
              color: color.color,
              fakeImg: fakeImageUrl,
            };
          }
        })
      );
      console.log(data.category, 'category');
      const formattedData = {
        title: data.title,
        price: Number.parseFloat(data.price),
        description: data.description,
        brand: data.brand,
        category: data.category.join(' '),
        img: mainImageUrl,
        img1: secondaryImageUrl,
        colors: JSON.stringify(processedColors),
        size: data.sizes,
      };
      console.log(formattedData, 'formattedData');
      const { data: updateData, error } = await supabase
        .from('products')
        .update(formattedData)
        .eq('id', product?.id);
      if (error) {
        console.log(error, 'error');
        toast.error('An error occurred while updating the product');
        setIsUploading(false);
        return;
      }
      if (updateData) toast.success('Product updated successfully');

      console.log(updateData, 'data');
    } catch (error) {
      console.error('Error processing product:', error);
      toast.error('An error occurred while adding the product');
    } finally {
      setIsUploading(false);
    }
  };
  const userData = useAppSelector(getUser);
  if (
    userData?.user?.user_metadata?.email !==
    process.env.NEXT_PUBLIC_EMAIL_ADDRESS
  )
    return redirect('/');
  return (
    <Card className='max-w-3xl mx-auto mt-10'>
      <CardHeader>
        <CardTitle>Update Product</CardTitle>
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

              {/* Product Brand */}
              <div className='space-y-2'>
                <Label htmlFor='brand'>Product Brand</Label>
                <Input
                  id='brand'
                  {...register('brand', {
                    required: 'Product brand is required',
                    minLength: {
                      value: 3,
                      message: 'Brand must be at least 3 characters',
                    },
                  })}
                />
                {errors.brand && (
                  <p className='text-sm text-destructive'>
                    {errors.brand.message}
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
                          checked={field.value?.includes(category)}
                          onCheckedChange={(checked) => {
                            const currentCategories = field.value || [];
                            const categoriesArray: string[] = Array.isArray(
                              currentCategories
                            )
                              ? currentCategories
                              : [currentCategories];

                            console.log(currentCategories, 'currentCategories');
                            const updatedCategories = checked
                              ? [...categoriesArray, category]
                              : categoriesArray.filter((c) => c !== category);
                            console.log(updatedCategories, 'updatedCategories');
                            field.onChange(updatedCategories);
                          }}
                          // checked={field.value?.includes(category)}
                          // onCheckedChange={(checked) => {
                          //   const updatedCategories = checked
                          //     ? [...field.value, category]
                          //     : field.value.filter((c) => c !== category);
                          //   field.onChange(updatedCategories);
                          // }}
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
                onClick={() => {
                  setColorPickerOpen(true);
                }}
              >
                <Plus className='h-4 w-4 mr-1' /> Add Coloring Images
              </Button>
            </div>

            {colorPickerOpen && (
              <div className='p-4 border rounded-md space-y-4'>
                <HexColorPicker
                  color={currentColor.hex}
                  onChange={(color: any) =>
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
                    variant={'outline'}
                    size='lg'
                    onClick={() => {
                      if (!currentColor.name.trim()) {
                        toast.error('Please enter a color name');
                        return;
                      }
                      if (!currentColor.imagePreview) {
                        toast.error('Please upload an image for this color');
                        return;
                      }

                      const newColor = {
                        hex: currentColor.hex,
                        color: currentColor.name,
                        fakeImg: currentColor.imagePreview,
                        image: currentColor.image,
                      };
                      console.log(newColor, 'color');
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
                    Add Coloring Images
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='lg'
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
            variant={'outline'}
            disabled={isUploading || !mainImage || !secondaryImage}
            className='w-full'
          >
            {isUploading ? 'Uploading...' : 'Save Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
