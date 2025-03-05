import React from 'react';

const Footer = () => {
  return (
    <div className=' w-full bg-secondary'>
      <div className='cont px-5 sm:px-0  py-14'>
        <div className=' flex flex-col sm:flex-row  justify-between gap-10'>
          <div>
            <h3 className='text-2xl font-young'>Links</h3>
            <ul className='font-albert'>
              <li>Home</li>
              <li>About</li>
              <li>Service</li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl font-young'>Policy</h3>
            <ul className='font-albert'>
              <li>Terms</li>
              <li>Conditions</li>
              <li>Process</li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl font-young'>Contact</h3>
            <ul className='font-albert'>
              <li>Email: majedahmed139z@gmail.com</li>
              <li>WhatsApp: +880 1703-297407</li>
              <li>Address: Zakigonj,Sylhet</li>
            </ul>
          </div>
        </div>
        <hr className='my-5 border-t-2 border-dashed border-tertiary opacity-50' />
        <div className='text-center'>
          <p className='opacity-60'>
            @All right reserved by Majed {new Date().getFullYear()}
          </p>
          <p className='opacity-60'>
            Developed by{' '}
            <a
              href='https://wa.me/+8801786224382'
              target='_blank'
              rel='noreferrer'
              className='underline hover:text-tertiary'
            >
              Md: Minhaj Uddin Tapader
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
