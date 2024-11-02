import { Post, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

const createUserLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const usersMap = new Map(users.map((user) => [user.id, user]));

    return userIds.map((userId) => usersMap.get(userId) || null);
  });

const createPostLoader = (prisma: PrismaClient) =>
  new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: [...authorIds] },
      },
    });

    const postsMap = posts.reduce((acc, post) => {
      if (!acc.has(post.authorId)) {
        acc.set(post.authorId, []);
      }

      acc.get(post.authorId)?.push(post);
      return acc;
    }, new Map<string, Post[]>());

    return authorIds.map((authorId) => postsMap.get(authorId) || []);
  });

const createMemberTypeLoader = (prisma: PrismaClient) =>
  new DataLoader(async (typeMemberIds: readonly string[]) => {
    const members = await prisma.memberType.findMany({
      where: { id: { in: [...typeMemberIds] } },
    });

    const membersMap = new Map(members.map((member) => [member.id, member]));

    return typeMemberIds.map((typeMemberId) => membersMap.get(typeMemberId) || null);
  });

const createProfileLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: [...userIds] },
      },
    });

    const profilesMap = new Map(profiles.map((profile) => [profile.userId, profile]));

    return userIds.map((profileId) => profilesMap.get(profileId) || null);
  });

export const createLoaders = (prisma: PrismaClient) => ({
  userLoader: createUserLoader(prisma),
  postLoader: createPostLoader(prisma),
  memberTypeLoader: createMemberTypeLoader(prisma),
  profileLoader: createProfileLoader(prisma),
});
