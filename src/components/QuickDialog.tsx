'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { addToCart, getCart } from '@/lib/redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { CiShoppingCart } from 'react-icons/ci';

export function QuickDialog({ id }: { id: string }) {
  const { product, getSingleProduct } = useSupabase();
  useEffect(() => {
    getSingleProduct(id);
  }, [id]);
  const [size, setSize] = useState(0);
  const [selectedColors, setSelectedColors] = useState(0);
  const dispatch = useAppDispatch();
  const handleClickColor = (color: number) => {
    setSelectedColors(color);
  };
  const { toast } = useToast();
  const data = useAppSelector(getCart);
  useEffect(() => {
    console.log(data, 'quick dialog 2');
  }, [data]);
  console.log(data, 'quick dialog');
  const whatsappLink = `https://wa.me/+8801786224382?text=Hi%2C%20I%20want%20to%20purchase%20this%20product%3A%0A%0A%20%20Title%3A%20${product?.title}%0A%20%20Price%3A%20${product?.price}%0A%20%20Size%3A%20${product?.size[size]}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CiShoppingCart className='h-5 w-5 cursor-pointer transition-all duration-300' />
      </DialogTrigger>
      {product && (
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              <div className='grid grid-cols-12  gap-4 py-4'>
                <div className=' col-span-3 h-full '>
                  <img
                    src={product?.colors[selectedColors]?.fakeImg}
                    className='h-24'
                    alt='pro-img'
                  />
                </div>
                <div className=' col-span-9 h-full '>
                  <h2>{product.title}</h2>
                  <p className='mt-2'>${product.price}</p>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              <div>
                <p className='mb-1'>
                  {product && product.size && product.size.length > 0 ? (
                    <span>Size :{product?.size[size]}</span>
                  ) : (
                    'not found'
                  )}
                </p>
                <div className=' flex gap-3'>
                  {product?.size?.map((siz, i) => (
                    <Button
                      key={siz}
                      onClick={() => setSize(i)}
                      className={`rounded-full border-tertiary/35 border bg-white text-black hover:border-black hover:border ${
                        size === i ? 'bg-black text-white' : ''
                      }`}
                    >
                      {siz}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className='mb-1'>
              {product && product.colors && product.colors.length > 0 ? (
                <span>Color: {product?.colors[selectedColors].color}</span>
              ) : (
                'not found'
              )}
            </p>
            <div className='flex gap-3'>
              {product.colors.map((it, i) => (
                <div
                  key={it.color}
                  className={`h-7 w-7 rounded-full cursor-pointer border-[1px] p-1 ${
                    selectedColors === i
                      ? 'border-black p-[5px]'
                      : 'border-gray-200 hover:p-[5px] hover:border-black'
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
        </DialogContent>
      )}
    </Dialog>
  );
}
