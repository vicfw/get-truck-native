import { Category } from '../../../globalTypes';

export interface CategoriesResponse {
  categoryList: {
    _id: string;
    children: Category[];
    categoryImage: string;
    name: string;
    parentId: string | null;
  }[];
}

export interface CategoriesWithoutChildrenResponse
  extends Omit<Category, 'children'> {}

export interface CategoriesWithoutChildrenResponse {
  data: {
    _id: string;
    children: Category[];
    categoryImage: string;
    name: string;
    parentId: string | null;
  }[];
}

export interface GetLastFourCategoriesResponse {
  data: Category[];
  status: string;
}
