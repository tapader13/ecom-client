'use client';
import { supabase } from '@/lib/supabase/product';

const SignInPage = () => {
  const handleGitHubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing in:', error.message);
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='w-3/12'>
        <button
          onClick={handleGitHubSignIn}
          className='w-full p-4 bg-black text-white rounded'
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
