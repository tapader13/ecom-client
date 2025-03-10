'use client';
import { useState } from 'react';
import { supabase } from '../supabase/product';
import { getAdapter } from 'axios';

interface Color {
  color: string;
  hex: string;
  fakeImg: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  img1: string;
  img: string;
  description: string;
  category: string;
  colors: Color[];
  size: string[];
  brand: string;
}
interface DynamicData {
  price: number;
  category: string;
  colors: string[];
  size: string[];
  sort: { _sort: string; _order: string };
}
export const useSupabase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dashboardProducts, setDashboardProducts] = useState<Product[]>([]);
  const [shirtProducts, setShirtProducts] = useState<Product[]>([]);
  const [pantProducts, setPantProducts] = useState<Product[]>([]);
  const [babyProducts, setBabyProducts] = useState<Product[]>([]);
  const [beggiProducts, setBeggiProducts] = useState<Product[]>([]);
  const [cargoProducts, setCargoProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>();
  const [proDlts, setProDlts] = useState<Product>();
  const [menProduct, setMenProduct] = useState<Product[]>([]);
  const [srcProduct, setSrcProduct] = useState<Product[]>([]);
  const [dynamicProduct, setDynamicProduct] = useState<Product[]>([]);
  const [product1, setProduct1] = useState<Product>();
  const [product2, setProduct2] = useState<Product>();
  const [product3, setProduct3] = useState<Product>();
  const getNewReleaseProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('category', `%newrelease%`);

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        // Check if colors need parsing
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setProducts(parsedData);
    }
  };
  const getDashboardProduct = async () => {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        // Check if colors need parsing
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setDashboardProducts(parsedData);
    }
  };
  const getShirtItems = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('category', `%shirt%`);

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        // Check if colors need parsing
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setShirtProducts(parsedData);
    }
  };
  const getPantItems = async (str: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('category', `%${str}%`);

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        // Check if colors need parsing
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });
      if (str === 'pant') {
        setPantProducts(parsedData);
      }
      if (str === 'beggi') {
        setBeggiProducts(parsedData);
      }
      if (str === 'cargo') {
        setCargoProducts(parsedData);
      }
      if (str === 'baby') {
        console.log(parsedData, 'parsedData');
        setBabyProducts(parsedData);
      }
    }
  };
  const getSingleProduct = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setProduct(parsedData[0]);
    }

    if (error) {
      console.log(error.message);
      return;
    }
  };
  const getProductDlts = async (img: string) => {
    const { data, error } = await supabase.from('products').select('*');

    if (data) {
      const parsedData = data
        .map((product) => {
          let colors: Color[] = [];
          try {
            colors =
              typeof product.colors === 'string'
                ? JSON.parse(product.colors)
                : product.colors;
            const imgMatches = product.img === img || product.img1 === img;
            const fakeImgMatches = colors.some(
              (color) => color.fakeImg === img
            );

            if (imgMatches || fakeImgMatches) {
              return {
                ...product,
                colors,
              };
            }
          } catch (e) {
            console.error('Error parsing colors:', e);
          }
          return null;
        })
        .filter(Boolean);
      setProDlts(parsedData[0]);
    }
    if (error) {
      console.log(error.message);
      return;
    }
  };
  const getMenProduct = async (cat: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('category', `%${cat}%`);

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setMenProduct(parsedData);
    }
  };
  const getBoundleProduct1 = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setProduct1(parsedData[0]);
    }

    if (error) {
      console.log(error.message);
      return;
    }
  };
  const getBoundleProduct2 = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });
      console.log(parsedData[0], 'parsedData[0]');

      setProduct2(parsedData[0]);
    }

    if (error) {
      console.log(error.message);
      return;
    }
  };
  const getBoundleProduct3 = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setProduct3(parsedData[0]);
    }

    if (error) {
      console.log(error.message);
      return;
    }
  };
  const getDynamicProduct = async ({
    price,
    category,
    colors,
    size,
    sort,
  }: DynamicData) => {
    console.log(price, category, colors, size, 1);

    let query = supabase.from('products').select('*').lte('price', `${price}`);
    console.log(query, 'query');
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    // ✅ Only apply `size` filter if it's defined and not empty
    if (Array.isArray(size) && size.length > 0) {
      query = query.contains('size', size);
    }

    const { data, error } = await query;
    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        let parsedColors: Color[] = [];
        try {
          parsedColors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors: parsedColors,
        };
      });

      let filteredData = parsedData;

      // ✅ Only apply `colors` filter if it's defined and not empty
      if (Array.isArray(colors) && colors.length > 0) {
        filteredData = parsedData.filter((product) => {
          return colors.every((color) =>
            product.colors.some(
              (productColor: any) =>
                productColor.color.toLowerCase() === color.toLowerCase()
            )
          );
        });
      }

      // Sorting logic
      if (sort?._sort && sort?._order) {
        filteredData = filteredData.sort((a: any, b: any) => {
          if (sort._order === 'asc') {
            return a[sort._sort] > b[sort._sort] ? 1 : -1;
          } else if (sort._order === 'desc') {
            return a[sort._sort] < b[sort._sort] ? 1 : -1;
          }
          return 0;
        });
      }

      setDynamicProduct(filteredData);
    }
  };

  const getSrcProduct = async (src: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`category.ilike.%${src}%,title.ilike.%${src}%`);
    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      const parsedData = data.map((product) => {
        let colors: Color[] = [];
        try {
          colors =
            typeof product.colors === 'string'
              ? JSON.parse(product.colors)
              : product.colors;
        } catch (e) {
          console.error('Error parsing colors:', e);
        }

        return {
          ...product,
          colors,
        };
      });

      setSrcProduct(parsedData);
    }
  };
  return {
    products,
    product,
    proDlts,
    menProduct,
    product1,
    product2,
    cargoProducts,
    product3,
    dynamicProduct,
    srcProduct,
    pantProducts,
    babyProducts,
    getPantItems,
    dashboardProducts,
    getDashboardProduct,
    shirtProducts,
    getShirtItems,
    getSrcProduct,
    beggiProducts,
    getDynamicProduct,
    getBoundleProduct1,
    getBoundleProduct2,
    getBoundleProduct3,
    getMenProduct,
    getProductDlts,
    getNewReleaseProduct,
    getSingleProduct,
  };
};
