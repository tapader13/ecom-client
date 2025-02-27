'use client';
import { FaRegHeart } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { CiShoppingCart } from 'react-icons/ci';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getCart } from '@/lib/redux/cart/cartSlice';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/product';
import SearchPart from './SearchPart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/provider/AuthProvider';
import { getUser, setUserInfo } from '@/lib/redux/user/userSlice';

const Header = () => {
  const data1 = useAppSelector(getCart);
  console.log(data1, 'tr');
  const userData = useAppSelector(getUser);
  console.log(userData, 'userData');
  const dispatch = useAppDispatch();

  // const { user, isAuthenticated } = useContext(AuthContext);
  // const as = useAppSelector((state) => state.cart);
  // console.log(as, 'as');
  const router = useRouter();

  return (
    <div className='w-screen bg-secondary'>
      <div className='cont flex justify-between items-center py-5 px-2 '>
        <div>
          <Link href={'/'}>
            <h1 className='text-3xl font-bold font-young cursor-pointer'>
              Ecomus
            </h1>
          </Link>
        </div>

        <div className='flex gap-5 items-center'>
          <div>
            <SearchPart />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer' asChild>
                {userData?.user ? (
                  <img
                    className='h-7 w-7 rounded-full'
                    src={userData?.user?.user_metadata?.avatar_url}
                    alt='profile-img'
                  />
                ) : (
                  <div>
                    <FiUser className='h-5 w-5 cursor-pointer hover:text-primary transition-all duration-300' />
                  </div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-56'>
                {userData?.user ? (
                  <DropdownMenuItem
                    onClick={async () => {
                      const { error } = await supabase.auth.signOut();
                      if (error) {
                        console.error('Error logging out:', error.message);
                      } else {
                        dispatch(setUserInfo(null));
                        window.location.reload(); // Reload the page after logging out
                        router.push('/signin'); // Redirect to sign-in page
                      }
                    }}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <Link href='/signin' passHref>
                      <div className='flex items-center'>
                        <LogIn className='mr-2 h-4 w-4' />
                        <span>Log In</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='relative'>
            <FaRegHeart className='h-5 w-5 cursor-pointer hover:text-primary transition-all duration-300' />
            <span className='absolute h-4 w-4 bg-primary rounded-full text-xs text-white flex items-center justify-center -top-2 -right-2'>
              0
            </span>
          </div>
          <Link href={'/cart'}>
            <div className='relative'>
              <CiShoppingCart className='h-5 w-5 cursor-pointer hover:text-primary transition-all duration-300' />
              {data1 && data1?.cart?.length > 0 && (
                <span className='absolute h-4 w-4 bg-priamry rounded-full text-xs text-white flex items-center justify-center -top-2 -right-2'>
                  {data1.cart.length}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
