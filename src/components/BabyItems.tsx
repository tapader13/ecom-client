'use client';
import React, { useEffect } from 'react';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { CarosulNewRelase } from './CarosulNewRelase';

const BabyItems = () => {
  const { babyProducts, getPantItems } = useSupabase();
  useEffect(() => {
    getPantItems('baby');
  }, []);
  return (
    <>
      {babyProducts.length > 0 && (
        <div className='mt-5'>
          <div className='cont'>
            <div className='flex justify-between items-center'>
              <h1 className='text-4xl leading-[90px] font-young'>
                Baby Items Collection
              </h1>
              <div>1</div>
            </div>
            <div>
              <CarosulNewRelase products={babyProducts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BabyItems;
