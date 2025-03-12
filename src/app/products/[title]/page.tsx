'use client';

import { BreadCrump } from '@/components/BreadCrump';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { addToCart, getCart } from '@/lib/redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
const ProductDetails = ({ params }: { params: { title: string } }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get('variant');
  const data = useAppSelector(getCart);
  const title = decodeURIComponent(params.title);
  const { proDlts, getProductDlts } = useSupabase();
  const [size, setSize] = useState(0);
  const [selectedColors, setSelectedColors] = useState<number>(0);
  const [imageSrc, setImageSrc] = useState(query);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (query) {
      getProductDlts(query.toString());
    }
  }, [query]);
  const { toast } = useToast();
  const handleClickColor = (color: number) => {
    setSelectedColors(color);
    const imgSelect = proDlts?.colors[color]?.fakeImg;
    if (imgSelect) {
      setImageSrc(imgSelect);
    }
  };
  const handleAddToCart = () => {
    const addData = {
      price: proDlts?.price,
      quantity: 1,
      size: proDlts?.size[size],
      color: proDlts?.colors[selectedColors],
      title: proDlts?.title,
      id: proDlts?.id,
      img: proDlts?.img,
      category: proDlts?.category,
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
          description: 'Product Add To Cart.',
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Product Already Added.',
        });
      }
    }
  };
  const handleImgChange = (img: string, i: number) => {
    setImageSrc(img);
    setSelectedColors(i);
  };
  // console.log(proDlts, 'prd');
  const whatsappLink = `https://wa.me/+8801619327606?text=হাই%2C%20আমি%20এই%20পণ্যটি%20কিনতে%20চাই%3A%0A%0A%20%20পণ্যের%20নাম%3A%20${proDlts?.title}%0A%20%20পণ্যের%20মূল্য%3A%20${proDlts?.price}%0A%20%20পণ্যের%20সাইজ%3A%20${proDlts?.size[size]}`;
  return (
    <div className='cont px-5 sm:px-0'>
      <div className='my-5'>
        <BreadCrump title={title} />
      </div>
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-10 '>
        <div className='grid sm:grid-cols-12 grid-cols-1 gap-3 h-[500px]'>
          <div className='sm:col-span-2 order-1 sm:order-none h-full gap-3 flex sm:flex-col flex-row  justify-between'>
            {proDlts &&
              proDlts?.colors?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => handleImgChange(img.fakeImg, i)}
                  className={` cursor-pointer sm:h-36 h-32 rounded-lg overflow-hidden w-full ${
                    imageSrc === img.fakeImg
                      ? ' border-4 border-black'
                      : 'border-4 border-transparent'
                  }`}
                >
                  <img src={img.fakeImg} className='h-full w-full' alt='' />
                </div>
              ))}
          </div>
          <div className='sm:col-span-10 sm:h-[600px] h-[400px]'>
            {proDlts && (
              <div className='w-full h-full'>
                <img
                  src={imageSrc || proDlts.img}
                  alt=''
                  className='h-full w-full'
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className=''>
            <h2 className='text-3xl font-semibold font-young'>
              {proDlts?.title}
            </h2>
            <p className='mt-2 font-albert text-2xl font-medium'>
              ${proDlts?.price}
            </p>
          </div>
          <div className='my-5'>
            <p className='mb-3'>
              {proDlts && proDlts.size ? (
                <span>Size :{proDlts?.size[size]}</span>
              ) : (
                'not found'
              )}
            </p>
            <div className=' flex gap-3'>
              {proDlts?.size?.map((siz, i) => (
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
          <div className='mb-5'>
            <p className='mb-3'>
              {proDlts && proDlts.colors && proDlts.colors.length > 0 ? (
                <span>Color: {proDlts?.colors[selectedColors].color}</span>
              ) : (
                'not found'
              )}
            </p>
            <div className='flex gap-3'>
              {proDlts &&
                proDlts.colors.map((it, i) => (
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
          <div className='mb-5'>
            <p className=' italic'>Brand: {proDlts?.brand}</p>
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
          <div className=''>
            <p className='mt-5 font-albert font-normal'>
              <span className='text-xl font-medium'>Description:</span>{' '}
              {proDlts?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
