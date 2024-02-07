import {mergeTypeDefs} from "@graphql-tools/merge"

import { usersGQLSchema } from "./user"
import { PostsGQLSchema } from "./posts"

export const mergedGQLSchema = mergeTypeDefs([usersGQLSchema, PostsGQLSchema])