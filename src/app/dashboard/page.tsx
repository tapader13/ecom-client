'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { supabase } from '@/lib/supabase/product';
import ProductForm from '@/components/ProductForm';

// Define the Color type
interface Color {
  hex: string;
  color: string;
  fakeImg: string;
}

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  img: string;
  img1: string;
  colors: Color[];
  size: string[];
  brand: string;
}

export default function ProductsPage() {
  // Sample data
  //   const initialProducts: Product[] = [
  //     {
  //       id: 2,
  //       title: 'Crossover Leggings',
  //       price: 22.3,
  //       description:
  //         'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
  //       category: 'newrelease women boundel',
  //       img: 'https://i.postimg.cc/N0hwgNny/asset-58.jpg',
  //       img1: 'https://i.postimg.cc/DZnkGSnn/asset-59.jpg',
  //       colors: [
  //         {
  //           hex: '#640D5F',
  //           color: 'purpel',
  //           fakeImg:
  //             'https://i.postimg.cc/DfghhPF6/image73-d42111c6-a66f-40c8-8093-9798d62604ce.webp',
  //         },
  //         {
  //           hex: '#F0A8D0',
  //           color: 'pink',
  //           fakeImg:
  //             'https://i.postimg.cc/Bn8fxWF7/image72-c0813a20-0be4-4616-9905-fe8cc848bf68.webp',
  //         },
  //         {
  //           hex: '#000000',
  //           color: 'black',
  //           fakeImg:
  //             'https://i.postimg.cc/vByRFcNC/image70-e9a36aee-fa80-426f-94b5-e0ef9fc812b2.webp',
  //         },
  //         {
  //           hex: '#664343',
  //           color: 'brown',
  //           fakeImg:
  //             'https://i.postimg.cc/Xvwh8nYL/image69-4b7d0ee9-2076-4a7f-aee1-edad49607994.webp',
  //         },
  //       ],
  //       size: ['X', 'L', 'M', 'S'],
  //       brand: 'Nike',
  //     },
  //     {
  //       id: 3,
  //       title: 'Mens Cotton Jacket',
  //       price: 55.99,
  //       description:
  //         'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
  //       category: 'newrelease frontpage',
  //       img: 'https://i.postimg.cc/BQQSyVW4/asset-56.jpg',
  //       img1: 'https://i.postimg.cc/sggMY2fP/asset-39.jpg',
  //       colors: [
  //         {
  //           hex: '#654520',
  //           color: 'brown',
  //           fakeImg:
  //             'https://i.postimg.cc/d01vN7g6/image71-adbed76e-1020-4f75-89b2-d0c4211612f3.webp',
  //         },
  //         {
  //           hex: '#664343',
  //           color: 'chocolate',
  //           fakeImg:
  //             'https://i.postimg.cc/QdYvtfng/image72-9de6d250-5895-4104-966b-11b2a3cf3723.webp',
  //         },
  //         {
  //           hex: '#6EC207',
  //           color: 'green',
  //           fakeImg:
  //             'https://i.postimg.cc/K85BrVyL/image73-6de4ea71-9cfc-4bc7-b3f1-294a2f12e0f9.webp',
  //         },
  //       ],
  //       size: ['X', 'L', 'M', 'S'],
  //       brand: 'Adidas',
  //     },
  //     {
  //       id: 4,
  //       title: 'Mens Casual Slim Fit',
  //       price: 15.99,
  //       description:
  //         'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.',
  //       category: 'newrelease women',
  //       img: 'https://i.postimg.cc/mgH06YrT/asset-60.jpg',
  //       img1: 'https://i.postimg.cc/pT24T3Jd/asset-61.jpg',
  //       colors: [
  //         {
  //           hex: '#181C14',
  //           color: 'black',
  //           fakeImg:
  //             'https://i.postimg.cc/ncSY6gWJ/image71-f9e65606-de6d-4db5-939c-67573b3cbd9c.webp',
  //         },
  //         {
  //           hex: '#B8001F',
  //           color: 'red',
  //           fakeImg:
  //             'https://i.postimg.cc/4NypbwxF/image72-ed4c098f-0b03-479d-9439-6301673f55a5.webp',
  //         },
  //         {
  //           hex: '#654520',
  //           color: 'brown',
  //           fakeImg:
  //             'https://i.postimg.cc/yY23hH5k/image73-9776d4fc-b448-4392-9e3f-c01c7d778d1f.webp',
  //         },
  //         {
  //           hex: '#6256CA',
  //           color: 'blue',
  //           fakeImg:
  //             'https://i.postimg.cc/N0BMbfxf/image70-af61ec9c-f1e3-479c-956d-7893f8ca76a2.webp',
  //         },
  //       ],
  //       size: ['X', 'L', 'M', 'S'],
  //       brand: 'Puma',
  //     },
  //   ];
  const { dashboardProducts, getDashboardProduct } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getDashboardProduct();
  }, []);
  useEffect(() => {
    if (dashboardProducts.length > 0) {
      setProducts(dashboardProducts);
    }
  }, [dashboardProducts]);
  console.log(dashboardProducts, 'dashboardProducts');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        const { data, error } = await supabase
          .from('products')
          .delete()
          .eq('id', selectedProduct.id);
        if (error) {
          throw error;
        }
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.log('Error deleting product:', error);
      }
    }
  };

  const saveProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsUpdateDialogOpen(false);
  };

  return (
    <div className='cont mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Product Management</h1>

      <div className='rounded-md border'>
        <ScrollArea className='h-[calc(100vh-200px)]'>
          <Table>
            <TableHeader className='sticky top-0 '>
              <TableRow>
                <TableHead className='w-[80px]'>ID</TableHead>
                <TableHead className='w-[200px]'>Image</TableHead>
                <TableHead className='w-[200px]'>Title</TableHead>
                <TableHead className='w-[100px]'>Price</TableHead>
                <TableHead className='w-[150px]'>Category</TableHead>
                <TableHead className='w-[150px]'>Colors</TableHead>
                <TableHead className='w-[100px]'>Sizes</TableHead>
                <TableHead className='w-[100px]'>Brand</TableHead>
                <TableHead className='w-[150px] text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <img
                      src={product.img || '/placeholder.svg'}
                      alt={product.title}
                      width={80}
                      height={80}
                      className='rounded-md object-cover'
                    />
                  </TableCell>
                  <TableCell className='font-medium'>{product.title}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.category.split(' ').map((cat, i) => (
                      <Badge key={i} variant='outline' className='mr-1 mb-1'>
                        {cat}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-1'>
                      {product.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className='w-6 h-6 rounded-full border'
                          style={{ backgroundColor: color.hex }}
                          title={color.color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs'>
                          +{product.colors.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {product.size.map((s, i) => (
                        <Badge key={i} variant='secondary' className='text-xs'>
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end space-x-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleView(product)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleUpdate(product)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        className='text-destructive'
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSave={saveProduct}
              onCancel={() => setIsUpdateDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              {selectedProduct && ` "${selectedProduct.title}"`} from the
              database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='aspect-square relative overflow-hidden rounded-lg'>
                  <img
                    src={selectedProduct.img || '/placeholder.svg'}
                    alt={selectedProduct.title}
                    className='object-cover'
                  />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='aspect-square relative overflow-hidden rounded-lg'>
                    <img
                      src={selectedProduct.img || '/placeholder.svg'}
                      alt={`${selectedProduct.title} - 1`}
                      className='object-cover'
                    />
                  </div>
                  <div className='aspect-square relative overflow-hidden rounded-lg'>
                    <img
                      src={selectedProduct.img1 || '/placeholder.svg'}
                      alt={`${selectedProduct.title} - 2`}
                      className='object-cover'
                    />
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-2xl font-bold'>
                    {selectedProduct.title}
                  </h3>
                  <p className='text-muted-foreground'>
                    ID: {selectedProduct.id}
                  </p>
                </div>
                <div>
                  <h4 className='text-xl font-semibold'>
                    ${selectedProduct.price.toFixed(2)}
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Brand: {selectedProduct.brand}
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold mb-1'>Description</h4>
                  <p className='text-sm'>{selectedProduct.description}</p>
                </div>
                <div>
                  <h4 className='font-semibold mb-1'>Category</h4>
                  <div className='flex flex-wrap gap-1'>
                    {selectedProduct.category.split(' ').map((cat, i) => (
                      <Badge key={i} variant='outline'>
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className='font-semibold mb-1'>Available Sizes</h4>
                  <div className='flex flex-wrap gap-2'>
                    {selectedProduct.size.map((s, i) => (
                      <Badge key={i} variant='secondary'>
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className='font-semibold mb-1'>Available Colors</h4>
                  <div className='flex flex-wrap gap-2'>
                    {selectedProduct.colors.map((color, i) => (
                      <div key={i} className='flex items-center gap-1'>
                        <div
                          className='w-6 h-6 rounded-full border'
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className='text-sm'>{color.color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            {selectedProduct && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleUpdate(selectedProduct);
                }}
              >
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
