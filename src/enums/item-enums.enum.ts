const CATEGORIES_BASE = {
    all_categories: 'all_categories',
    dairy: 'dairy',
    vegetable: 'vegetable',
    fruit: 'fruit',
    grains: 'grains',
    meat: 'meat',
    seafood: 'seafood',
} as const;

export type CATEGORIES =
    (typeof CATEGORIES_BASE)[keyof typeof CATEGORIES_BASE];


const STATUS_BASE = {
    status:'all_status',
    fresh:'fresh',
    expiring_soon:'expiring_soon',
    expired:'expired',
} as const;

export type STATUS =
    (typeof STATUS_BASE)[keyof typeof STATUS_BASE];


const FILTER_BASE = {
    expiry_date:'expiry_date',
    name:'name',
    category:'category',
    date_added:'date_added',
} as const;

export type FILTER =
    (typeof FILTER_BASE)[keyof typeof FILTER_BASE];