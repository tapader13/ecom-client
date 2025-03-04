'use client';
import React, { useEffect } from 'react';
import { CarosulNewRelase } from './CarosulNewRelase';
import { useSupabase } from '@/lib/hooks/useSupabase';

const CargoItems = () => {
  const { cargoProducts, getPantItems } = useSupabase();
  useEffect(() => {
    getPantItems('cargo');
  }, []);
  return (
    <>
      {cargoProducts.length > 0 && (
        <div className='sm:mt-20 mt-5'>
          <div className='cont'>
            <div className='flex justify-between items-center'>
              <h1 className='text-4xl leading-[90px] font-young'>Cargo Pant</h1>
              <div>1</div>
            </div>
            <div>
              <CarosulNewRelase products={cargoProducts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CargoItems;
