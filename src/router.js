import Vue from 'vue';
import Router from 'vue-router';

import Library from './components/top/Library.vue';
import Classroom from './components/top/Classroom.vue';
import Learn from './components/top/Learn.vue';
import Coding from './components/top/Coding.vue';

import Poems from './components/top/Poems.vue';
import EditPoem from './components/poems/EditPoem.vue';
import ViewPoem from './components/poems/ViewPoem.vue';
import DiscoverPoems from './components/poems/DiscoverPoems.vue';

import News from './components/top/News.vue';
import NewsHome from "./components/news/Home.vue";
import NewsHot from "./components/news/Hot.vue";
import NewsWeekly from "./components/news/Weekly.vue";
import NewsMonthly from "./components/news/Monthly.vue";
import NewsYearly from "./components/news/Yearly.vue";
import CreateNews from "./components/news/CreateNews.vue";
import ViewNews from "./components/news/ViewNews.vue";

import Works from './components/top/Works.vue';
import Articles from './components/works/Articles.vue';
import Collections from './components/works/Collections.vue';
import Books from './components/works/Books.vue';
import Translations from './components/works/Translations.vue';
import Collaborations from './components/works/Collaborations.vue';

import Write from './components/works/articles/Write.vue';
import ViewArticle from './components/works/articles/ViewArticle.vue';

import EditCollection from './components/works/collections/EditCollection.vue';

import EditBook from './components/works/books/EditBook.vue';
import BookDetail from './components/works/books/BookDetail.vue';
import BookToc from './components/works/books/BookToc.vue';
import BookComments from './components/works/books/BookComments.vue';
import EditChapter from './components/works/books/EditChapter.vue';

import EditCollabBook from './components/works/collaborations/EditBook.vue';

import AddTranslation from './components/works/translations/AddTranslation.vue';

import People from './components/top/People.vue';
import Authors from './components/people/Authors.vue';
import PeopleView from './components/people/View.vue';
import EditAuthor from './components/people/EditAuthor.vue';

import Dev from './components/top/Dev.vue';
import Book from './components/book/Book.vue';
import Reader from './components/book/Reader.vue';
import Translater from './components/book/Translater.vue';
import Notes from './components/book/Notes.vue';
import Login from './components/user/Login.vue';
import Register from './components/user/Register.vue';

import ReviewBook from './components/reviews/ReviewBook.vue';
import ReviewPlan from './components/reviews/ReviewPlan.vue';
import ReviewChapter from './components/reviews/ReviewChapter.vue';

import Profile from './components/users/Profile.vue';

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirects: '/library'
  },
  {
    path: '/library',
    component: Library
  },
  {
    path: '/learn',
    component: Learn
  },
  {
    path: '/poems',
    component: Poems
  },
  {
    path: '/poems/discover',
    component: DiscoverPoems
  },
  {
    path: '/poems/edit',
    component: EditPoem
  },
  {
    path: '/poems/view/:poemid',
    component: ViewPoem
  },
  {
    path: '/classroom',
    component: Classroom 
  },
  {
    path: '/news',
    component: News,
    children: [
      {
        path: '',
        component: NewsHome,
      },
      {
        path: 'home',
        component: NewsHome
      },
      {
        path: 'hot',
        component: NewsHot
      },
      {
        path: 'weekly',
        component: NewsWeekly
      },
      {
        path: 'monthly',
        component: NewsMonthly
      },
      {
        path: 'yearly',
        component: NewsYearly
      },

      {
        path: "create",
        component: CreateNews
      },
      {
        path: "view/:newsid",
        component: ViewNews
      }
    ]
  },
  {
    path: '/works',
    component: Works,
    children: [
      {
        path: '',
        component: Articles
      },
      {
        path: 'articles',
        component: Articles
      },
      {
        path: 'articles/:artid',
        component: ViewArticle
      },
      {
        path: 'write',
        component: Write
      },
      {
        path: 'write/:artid',
        component: Write
      },
      {
        path: 'collections',
        component: Collections,
      },
      {
        path: 'collections/edit',
        component: EditCollection
      },
      {
        path: 'collections/edit/:colid',
        component: EditCollection
      },
      {
        path: 'books',
        component: Books
      },
      {
        path: 'books/edit',
        component: EditBook,
      },
      {
        path: 'books/edit/:bookid',
        component: EditBook,
      },
      {
        path: 'books/edit/:bookid/:chapid',
        component: EditChapter,
      },
      {
        path: 'books/detail/:bookid',
        component: BookDetail,
        children: [
          {
            path: 'toc',
            component: BookToc
          },
          {
            path: 'comments',
            component: BookComments
          }
        ]
      },
      {
        path: 'translations',
        component: Translations
      },
      {
        path: 'translations/add',
        component: AddTranslation
      },
      {
        path: 'translations/detail/:bookid',
        component: BookDetail,
        children: [
          {
            path: 'toc',
            component: BookToc
          },
          {
            path: 'comments',
            component: BookComments
          }
        ]
      },
      {
        path: 'collaborations',
        component: Collaborations
      },
      {
        path: 'collaborations/edit',
        component: EditCollabBook
      },
      {
        path: 'collaborations/edit/:bookid',
        component: EditCollabBook
      },
      {
        path: 'collaborations/detail/:bookid',
        component: BookDetail,
        children: [
          {
            path: 'toc',
            component: BookToc
          },
          {
            path: 'comments',
            component: BookComments
          }
        ]
      },
    ]
  },
  {
    path: '/translater/book/:bookid/:chapid',
    component: Translater
  },
  {
    path: '/notes',
    component: Notes
  },
  {
    path: '/people',
    component: People,
    children: [
      {
        path: 'authors',
        component: Authors
      },
      {
        path: 'authors/edit',
        component: EditAuthor
      },
      {
        path: 'authors/edit/:pid',
        component: EditAuthor
      }
    ]
  },
  {
    path: '/people/view/:pid',
    component: PeopleView
  },
  {
    path: '/book/:id',
    component: Book
  },
  {
    path: '/reader/:bookid',
    component: Reader
  },
  {
    path: '/reader/:bookid/:chapid',
    component: Reader
  },
  {
    path: '/user/register',
    component: Register
  },
  {
    path: '/user/login',
    component: Login
  },
  {
    path: '/coding',
    component: Coding
  },
  {
    path: '/dev',
    component: Dev
  },
  {
    path: '/review/book/:bookid',
    component: ReviewBook
  },
  {
    path: '/review/plan/:bookid',
    component: ReviewPlan
  },
  {
    path: '/review/chapter/:bookid/:chapid',
    component: ReviewChapter
  },
  {
    path: '/review/chapter/:bookid/:chapid/:sentid',
    component: ReviewChapter
  },
  {
    path: '/:user/',
    component: Profile,
  }
]

const router = new Router({
  routes
});

export default router;