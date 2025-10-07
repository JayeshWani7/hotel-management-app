import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { RegisterUserInput, UpdateUserInput } from './dto/user.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: any): Promise<User> {
    return this.usersService.findOne(context.req.user.userId);
  }

  // Removed invalid register mutation as UsersService does not have a register method.
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context: any,
  ): Promise<User> {
    return this.usersService.update(context.req.user.userId, updateUserInput);
  }

  @Mutation(() => Boolean)
@UseGuards(JwtAuthGuard)
async deleteUser(@Args('id') id: string): Promise<boolean> {
  const user = await this.usersService.remove(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

}