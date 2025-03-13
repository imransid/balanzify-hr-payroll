import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const pathFinderMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let filePath: string = await next();
  return `${process.env.BASE_URL}/${filePath}`;
};

export const pathFinderMiddlewareForArrayOfString: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let filePath: string[] = await next();
  let paths:string[] = []
  filePath.map((path)=> {
    paths = [...paths,`${process.env.BASE_URL}/${path}`]
  })
  return [...paths];
};