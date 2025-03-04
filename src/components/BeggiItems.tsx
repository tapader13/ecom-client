'use client';
import React, { useEffect } from 'react';
import { CarosulNewRelase } from './CarosulNewRelase';
import { CarosulShirtItems } from './CarosulShirtItems';
import { useSupabase } from '@/lib/hooks/useSupabase';

const BeggiItems = () => {
  const { beggiProducts, getPantItems } = useSupabase();
  useEffect(() => {
    getPantItems('beggi');
  }, []);
  return (
    <>
      {beggiProducts.length > 0 && (
        <div className='sm:mt-20 mt-5'>
          <div className='cont'>
            <div className='flex justify-between items-center'>
              <h1 className='text-4xl leading-[90px] font-young'>Beggi Pant</h1>
              <div>1</div>
            </div>
            <div>
              <CarosulNewRelase products={beggiProducts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeggiItems;
