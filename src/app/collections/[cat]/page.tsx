'use client';
import { RiFilter3Line } from 'react-icons/ri';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupabase } from '@/lib/hooks/useSupabase';
import CardData from '@/components/CardData';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
const themes = [
  { name: 'Beige', color: '#F5F5DC', count: 0 },
  { name: 'Black', color: '#000000', count: 11 },
  { name: 'Blue', color: '#0000FF', count: 2 },
  { name: 'Brown', color: '#A52A2A', count: 2 },
  { name: 'Cream', color: '#FFFDD0', count: 0 },
  { name: 'Dark Beige', color: '#A99A86', count: 1 },
  { name: 'Dark Blue', color: '#00008B', count: 1 },
  { name: 'Green', color: '#006400', count: 0 },
  { name: 'Dark Grey', color: '#A9A9A9', count: 1 },
  { name: 'Grey', color: '#808080', count: 2 },
  { name: 'Light Blue', color: '#ADD8E6', count: 3 },
  { name: 'Light Green', color: '#90EE90', count: 1 },
  { name: 'Light Grey', color: '#D3D3D3', count: 0 },
  { name: 'Light Pink', color: '#FFB6C1', count: 1 },
  { name: 'Light Purple', color: '#D8BFD8', count: 2 },
  { name: 'Light Yellow', color: '#FFFFE0', count: 0 },
  { name: 'Orange', color: '#FFA500', count: 1 },
  { name: 'Pink', color: '#FFC0CB', count: 2 },
  { name: 'Taupe', color: '#483C32', count: 1 },
  { name: 'White', color: '#FFFFFF', count: 8 },
  { name: 'White Striped', color: '#F5F5F5', count: 1 },
  { name: 'Yellow', color: '#FFFF00', count: 0 },
];

const CategoryPage = ({ params }: { params: { cat: string } }) => {
  const [price, setPrice] = useState(500);
  const [colors, setColors] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [sort, setSort] = useState({ _sort: '', _order: '' });
  const category = params.cat;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const { dynamicProduct, getDynamicProduct } = useSupabase();
  useEffect(() => {
    getDynamicProduct({ price, category, colors, size, sort });
  }, [price, category, colors, size, sort]);
  const paginateData = dynamicProduct?.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [price, sort, colors, size]);
  console.log(dynamicProduct, category, 'dy', sort);
  console.log(category, 'cat', price, category, colors, size, sort);
  return (
    <div>
      <div className='bg-[#FCF3F2] flex flex-col items-center justify-center py-14'>
        <h1 className=' text-4xl font-normal'>New Arrival</h1>
        <p className='mt-3 text-tertiary'>
          Shop through our latest selection of Fashion
        </p>
      </div>
      <div className='cont'>
        <div className='flex justify-between my-10'>
          <div>
            <Sheet>
              <SheetTrigger className='rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white flex items-center gap-1'>
                <span>
                  <RiFilter3Line />
                </span>{' '}
                FILTER
              </SheetTrigger>
              <SheetContent>
                <ScrollArea className='h-full'>
                  <SheetHeader>
                    <Accordion type='multiple' className='w-full'>
                      <AccordionItem value='item-1'>
                        <AccordionTrigger>Product categories</AccordionTrigger>
                        <AccordionContent>
                          <ul className='flex flex-col gap-3'>
                            <Link
                              className={`hover:text-priamry transition-all duration-300 ${
                                params.cat === 'frontpage' ? 'text-priamry' : ''
                              }`}
                              href={'/collections/fashion'}
                            >
                              Fashion
                            </Link>
                            <Link
                              className={`hover:text-priamry transition-all duration-300 ${
                                params.cat === 'man' ? 'text-priamry' : ''
                              }`}
                              href={'/collections/man'}
                            >
                              Man
                            </Link>
                            <Link
                              className={`hover:text-priamry transition-all duration-300 ${
                                params.cat === 'women' ? 'text-priamry' : ''
                              }`}
                              href={'/collections/women'}
                            >
                              Women
                            </Link>
                            <Link
                              className={`hover:text-priamry transition-all duration-300 ${
                                params.cat === 'newrelease'
                                  ? 'text-priamry'
                                  : ''
                              }`}
                              href={'/collections/newrelease'}
                            >
                              Newrelease
                            </Link>
                            <Link
                              className={`hover:text-priamry transition-all duration-300 ${
                                params.cat === 'boundle' ? 'text-priamry' : ''
                              }`}
                              href={'/collections/boundle'}
                            >
                              Boundle
                            </Link>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value='item-2'>
                        <AccordionTrigger>Price</AccordionTrigger>
                        <AccordionContent>
                          <Slider
                            defaultValue={[price]}
                            onValueChange={(value) => setPrice(value[0])}
                            max={5000}
                            step={1}
                          />
                          <div className='my-5'>
                            <span className='text-tertiary text-xl'>
                              Price: ${1} - ${price} USD
                            </span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value='item-3'>
                        <AccordionTrigger>Color</AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea className='h-[200px]'>
                            <div>
                              {themes.map((theme, index) => (
                                <div
                                  onClick={() =>
                                    setColors((prev) =>
                                      prev.includes(theme.name.toLowerCase())
                                        ? prev.filter(
                                            (col) =>
                                              col.toLowerCase() !==
                                              theme.name.toLowerCase()
                                          )
                                        : [...prev, theme.name.toLowerCase()]
                                    )
                                  }
                                  className={`flex ${
                                    colors.includes(theme.name.toLowerCase())
                                      ? 'bg-slate-200 p-2'
                                      : ''
                                  } mb-5 items-center gap-2 cursor-pointer`}
                                  key={index}
                                >
                                  <div
                                    className='h-5 w-5 rounded-full'
                                    style={{ backgroundColor: theme.color }}
                                  ></div>
                                  <h4 className='text-tertiary'>
                                    {theme.name}{' '}
                                  </h4>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value='item-4'>
                        <AccordionTrigger>Size</AccordionTrigger>
                        <AccordionContent>
                          <div className='flex mb-5 items-center gap-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={size.includes('XL')}
                              value={'XL'}
                              name=''
                              onChange={(e) =>
                                setSize((prev) =>
                                  prev.includes(e.target.value)
                                    ? prev.filter(
                                        (siz) => siz !== e.target.value
                                      )
                                    : [...prev, e.target.value]
                                )
                              }
                              id=''
                            />
                            <h4 className='text-tertiary'>XL</h4>
                          </div>
                          <div className='flex mb-5 items-center gap-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={size.includes('L')}
                              value={'L'}
                              name=''
                              onChange={(e) =>
                                setSize((prev) =>
                                  prev.includes(e.target.value)
                                    ? prev.filter(
                                        (siz) => siz !== e.target.value
                                      )
                                    : [...prev, e.target.value]
                                )
                              }
                              id=''
                            />
                            <h4 className='text-tertiary'>L</h4>
                          </div>
                          <div className='flex mb-5 items-center gap-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={size.includes('S')}
                              value={'S'}
                              onChange={(e) =>
                                setSize((prev) =>
                                  prev.includes(e.target.value)
                                    ? prev.filter(
                                        (siz) => siz !== e.target.value
                                      )
                                    : [...prev, e.target.value]
                                )
                              }
                              name=''
                              id=''
                            />
                            <h4 className='text-tertiary'>S</h4>
                          </div>
                          <div className='flex mb-5 items-center gap-2 cursor-pointer'>
                            <input
                              checked={size.includes('M')}
                              type='checkbox'
                              value={'M'}
                              name=''
                              onChange={(e) =>
                                setSize((prev) =>
                                  prev.includes(e.target.value)
                                    ? prev.filter(
                                        (siz) => siz !== e.target.value
                                      )
                                    : [...prev, e.target.value]
                                )
                              }
                              id=''
                            />
                            <h4 className='text-tertiary'>M</h4>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </SheetHeader>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <div>
            {' '}
            <Select
              onValueChange={(value) => {
                if (value === 'A to Z') {
                  // setPage(1);
                  setSort({ _sort: 'title', _order: 'asc' });
                } else if (value === 'Price low to high') {
                  setSort({ _sort: 'price', _order: 'asc' });
                } else if (value === 'Price high to low') {
                  setSort({ _sort: 'price', _order: 'desc' });
                }
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sort The Product' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value='A to Z'>A to Z</SelectItem>
                  <SelectItem value='Price low to high'>
                    Price low to high
                  </SelectItem>
                  <SelectItem value='Price high to low'>
                    Price high to low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* card data loading start here */}
        <div>
          <CardData dynamicProduct={paginateData} />
        </div>
        {dynamicProduct.length > 0 && (
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={() => {
                      setPage((prev) => (prev > 1 ? prev - 1 : prev));
                    }}
                  />
                </PaginationItem>
              )}

              {Array.from(
                { length: Math.ceil(dynamicProduct.length / perPage) },
                (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => {
                        setPage(i + 1);
                      }}
                      isActive={i + 1 === page}
                      href='#'
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              {page < Math.ceil(dynamicProduct.length / perPage) && (
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={() => {
                      setPage((prev) =>
                        prev === Math.ceil(dynamicProduct.length / perPage)
                          ? prev
                          : prev + 1
                      );
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
