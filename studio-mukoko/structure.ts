import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('mukoko blog')
    .items([
      // Editorial
      S.listItem()
        .title('Editorial')
        .child(
          S.list()
            .title('Editorial')
            .items([
              S.listItem()
                .title('All Posts')
                .child(
                  S.documentList()
                    .title('All Posts')
                    .filter('_type == "post"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Published')
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "post" && defined(publishedAt)'),
                ),
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "post" && !defined(publishedAt)'),
                ),
            ]),
        ),

      S.divider(),

      // Browse by category
      S.listItem()
        .title('Posts by Category')
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .child((categoryId) =>
              S.documentList()
                .title('Posts')
                .filter('_type == "post" && $categoryId in categories[]._ref')
                .params({categoryId}),
            ),
        ),

      // Browse by author
      S.listItem()
        .title('Posts by Author')
        .child(
          S.documentTypeList('author')
            .title('Authors')
            .child((authorId) =>
              S.documentList()
                .title('Posts')
                .filter('_type == "post" && $authorId == author._ref')
                .params({authorId}),
            ),
        ),

      S.divider(),

      // Manage
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('category').title('Categories')),
    ])
