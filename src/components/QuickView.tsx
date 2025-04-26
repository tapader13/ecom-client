'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { addToCart, getCart } from '@/lib/redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { FaRegEye } from 'react-icons/fa';

export function QuickView({ id }: { id: string }) {
  const { product, getSingleProduct } = useSupabase();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const data = useAppSelector(getCart);

  const [size, setSize] = useState(0);
  const [selectedColors, setSelectedColors] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    getSingleProduct(id);
  }, [id]);

  const handleClickColor = (color: number) => {
    setSelectedColors(color);
    const imgSelect = product?.colors[color]?.fakeImg;
    if (imgSelect) {
      setImageSrc(imgSelect);
    }
  };

  const handleAddToCart = () => {
    const addData = {
      price: product?.price,
      quantity: 1,
      size: product?.size[size],
      color: product?.colors[selectedColors],
      title: product?.title,
      id: product?.id,
      img: product?.img,
      category: product?.category,
    };

    if (
      addData.price &&
      addData.size &&
      addData.color &&
      addData.title &&
      addData.id &&
      addData.img &&
      addData.category
    ) {
      const findId = data.cart.find((dt) => dt.id === addData.id);
      const findSize = data.cart.find((dt) => dt.size === addData.size);
      const findColor = data.cart.find((dt) => dt.color === addData.color);

      if (!findId || !findSize || !findColor) {
        dispatch(addToCart(addData));
        toast({
          description: 'Product Added to Cart.',
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Product Already Added.',
        });
      }
    }
  };
  const whatsappLink = `https://wa.me/+8801619327606?text=হাই%2C%20আমি%20এই%20পণ্যটি%20কিনতে%20চাই%3A%0A%0A%20%20পণ্যের%20নাম%3A%20${product?.title}%0A%20%20পণ্যের%20মূল্য%3A%20${product?.price}%0A%20%20পণ্যের%20সাইজ%3A%20${product?.size[size]}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaRegEye className='h-5 w-5 cursor-pointer transition-all duration-300' />
      </DialogTrigger>
      {product && (
        <DialogContent className='sm:max-w-[900px]'>
          <DialogHeader>
            <DialogTitle className='text-3xl font-semibold'>
              {product?.title}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable area on smaller screens */}
          <ScrollArea className='sm:hidden h-[500px]'>
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-10'>
              {/* Left side - Product Image */}
              <div className='grid sm:grid-cols-12 grid-cols-1 gap-3 h-[500px]'>
                <div className='sm:col-span-12 sm:h-[600px] h-[400px]'>
                  <img
                    src={imageSrc || product?.img}
                    alt={product?.title}
                    className='h-full w-full object-cover'
                  />
                </div>
              </div>

              {/* Right side - Product Details */}
              <div>
                <div className=''>
                  <h2 className='text-3xl font-semibold'>{product?.title}</h2>
                  <p className='mt-2 text-2xl font-medium'>${product?.price}</p>
                </div>

                {/* Size Selection */}
                <div className='my-5'>
                  <p className='mb-3'>
                    {product?.size?.length > 0 ? (
                      <span>Size: {product?.size[size]}</span>
                    ) : (
                      'Size not found'
                    )}
                  </p>
                  <div className='flex gap-3'>
                    {product?.size?.map((siz, i) => (
                      <Button
                        key={siz}
                        onClick={() => setSize(i)}
                        className={`rounded-full border-tertiary/35 border bg-white text-black hover:border-black ${
                          size === i ? 'bg-black text-white' : ''
                        }`}
                      >
                        {siz}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className='mb-5'>
                  <p className='mb-3'>
                    {product?.colors?.length > 0 ? (
                      <span>
                        Color: {product?.colors[selectedColors].color}
                      </span>
                    ) : (
                      'Color not found'
                    )}
                  </p>
                  <div className='flex gap-3'>
                    {product?.colors.map((it, i) => (
                      <div
                        key={it.color}
                        className={`h-7 w-7 rounded-full cursor-pointer border p-1 ${
                          selectedColors === i
                            ? 'border-black p-[5px]'
                            : 'border-gray-200 hover:border-black'
                        } transition-all duration-300`}
                        onClick={() => handleClickColor(i)}
                      >
                        <div
                          className='w-full h-full rounded-full'
                          style={{ backgroundColor: it.hex }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className='mx-auto'>
                  <a
                    href={whatsappLink}
                    target='_blank'
                    onClick={(e) => e.stopPropagation()}
                    rel='noopener noreferrer'
                    className='bg-black px-10 py-2 z-50 rounded-md text-white font-albert font-bold'
                  >
                    Order Now
                  </a>
                </div>

                {/* Product Description */}
                <div className='mt-5'>
                  <p className='text-xl font-medium'>Description:</p>
                  <p className='mt-2'>{product?.description}</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Scrollable area for larger screens */}
          <div className='hidden sm:block'>
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-10'>
              {/* Left side - Product Image */}
              <div className='grid sm:grid-cols-12 grid-cols-1 gap-3 h-[500px]'>
                <div className='sm:col-span-12 sm:h-[400px] h-[400px]'>
                  <img
                    src={imageSrc || product?.img}
                    alt={product?.title}
                    className='h-full w-full object-cover'
                  />
                </div>
              </div>

              {/* Right side - Product Details */}
              <div>
                <div className=''>
                  <h2 className='text-3xl font-semibold'>{product?.title}</h2>
                  <p className='mt-2 text-2xl font-medium'>${product?.price}</p>
                </div>

                {/* Size Selection */}
                <div className='my-5'>
                  <p className='mb-3'>
                    {product?.size?.length > 0 ? (
                      <span>Size: {product?.size[size]}</span>
                    ) : (
                      'Size not found'
                    )}
                  </p>
                  <div className='flex gap-3'>
                    {product?.size?.map((siz, i) => (
                      <Button
                        key={siz}
                        onClick={() => setSize(i)}
                        className={`rounded-full border-tertiary/35 border bg-white text-black hover:border-black ${
                          size === i ? 'bg-black text-white' : ''
                        }`}
                      >
                        {siz}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className='mb-5'>
                  <p className='mb-3'>
                    {product?.colors?.length > 0 ? (
                      <span>
                        Color: {product?.colors[selectedColors].color}
                      </span>
                    ) : (
                      'Color not found'
                    )}
                  </p>
                  <div className='flex gap-3'>
                    {product?.colors.map((it, i) => (
                      <div
                        key={it.color}
                        className={`h-7 w-7 rounded-full cursor-pointer border p-1 ${
                          selectedColors === i
                            ? 'border-black p-[5px]'
                            : 'border-gray-200 hover:border-black'
                        } transition-all duration-300`}
                        onClick={() => handleClickColor(i)}
                      >
                        <div
                          className='w-full h-full rounded-full'
                          style={{ backgroundColor: it.hex }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className='mx-auto'>
                  <a
                    href={whatsappLink}
                    target='_blank'
                    onClick={(e) => e.stopPropagation()}
                    rel='noopener noreferrer'
                    className='bg-black px-10 py-2 z-50 rounded-md text-white font-albert font-bold'
                  >
                    Order Now
                  </a>
                </div>

                {/* Product Description */}
                <div className='mt-5'>
                  <p className='text-xl font-medium'>Description:</p>
                  <p className='mt-2'>{product?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
