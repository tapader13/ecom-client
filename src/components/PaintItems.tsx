'use client';
import React, { useEffect } from 'react';
import { CarosulNewRelase } from './CarosulNewRelase';
import { useSupabase } from '@/lib/hooks/useSupabase';

const PaintItems = () => {
  const { pantProducts, getPantItems } = useSupabase();
  useEffect(() => {
    getPantItems('pant');
  }, []);
  return (
    <>
      {pantProducts.length > 0 && (
        <div className='sm:mt-20 mt-5'>
          <div className='cont'>
            <div className='flex justify-between items-center'>
              <h1 className='text-4xl leading-[90px] font-young'>
                Pants Items
              </h1>
              <div>1</div>
            </div>
            <div>
              <CarosulNewRelase products={pantProducts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaintItems;
