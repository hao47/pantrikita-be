export enum Category {

    FRUIT = 'fruit',
    VEGETABLE = 'vegetable',
    MEAT = 'meat',
    DAIRY = 'dairy',
    GRAINS = 'grains',
    SEAFOOD = 'seafood',
}


export enum Categories {
    all_categories = 'all_categories',
    dairy = 'dairy',
    vegetable = 'vegetable',
    fruit = 'fruit',
    grains = 'grains',
    meat = 'meat',
    seafood = 'seafood',
}

export enum Status {
    status = 'all_status',
    fresh = 'fresh',
    expiring_soon = 'expiring_soon',
    expired = 'expired',
}

export enum Filter {
    expiry_date = 'expiry_date',
    name = 'name',
    category = 'category',
    date_added = 'date_added',
}


export enum StatusFormat {
    SIMPLE = 'simple',           // ExpiredStatus
    HEADER = 'header',           // ExpiredStatusHeaderDetail
    DETAILED = 'detailed'        // ExpiredStatusHeaderMoreDetail
}
