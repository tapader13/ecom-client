'use client';

import { useState, useEffect } from 'react';
interface ColorPicker {
  color: string;
  onChange: (color: string) => void;
}
export function HexColorPicker({ color, onChange }: ColorPicker) {
  const [internalColor, setInternalColor] = useState(color || '#000000');

  useEffect(() => {
    if (color !== internalColor) {
      setInternalColor(color);
    }
  }, [color, internalColor]); // Added internalColor to dependencies

  const handleChange = (e: any) => {
    const newColor = e.target.value;
    setInternalColor(newColor);
    onChange(newColor);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <div
          className='w-12 h-12 rounded-md border'
          style={{ backgroundColor: internalColor }}
        />
        <input
          type='text'
          value={internalColor}
          onChange={handleChange}
          className='px-3 py-2 border rounded-md'
        />
        <input
          type='color'
          value={internalColor}
          onChange={handleChange}
          className='w-10 h-10'
        />
      </div>
    </div>
  );
}
