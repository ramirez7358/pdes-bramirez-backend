import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { MeliService } from '../meli/meli.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let meliService: MeliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: MeliService,
          useValue: {
            getCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    meliService = module.get<MeliService>(MeliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getCategories on MeliService and return the result', async () => {
    const categories = [{ id: '1', name: 'Category 1' }];
    jest.spyOn(meliService, 'getCategories').mockResolvedValue(categories);

    const result = await service.getCategories();
    expect(result).toEqual(categories);
    expect(meliService.getCategories).toHaveBeenCalled();
  });
});
