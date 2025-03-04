'use client';
import React, { useEffect } from 'react';
import { CarosulNewRelase } from './CarosulNewRelase';
import { CarosulShirtItems } from './CarosulShirtItems';
import { useSupabase } from '@/lib/hooks/useSupabase';

const ShirtItems = () => {
  const { shirtProducts, getShirtItems } = useSupabase();
  useEffect(() => {
    getShirtItems();
  }, []);
  return (
    <div className='sm:mt-20 mt-5'>
      {shirtProducts.length > 0 && (
        <div className='cont'>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl leading-[90px] font-young'>Shirt Items</h1>
            <div>1</div>
          </div>
          <div>
            <CarosulShirtItems />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShirtItems;
