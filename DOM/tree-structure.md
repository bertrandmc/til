DOM prototype tree:

                              NULL
                               |
                             Object
                          /    |    \
                        /      |      \
                      /        |        \
            HTMLCollection    Node    NodeList
                            /  |  \
                          /    |    \
                        /      |      \
            CharacterData   Element   Document
            /  \               |           |
          /     \              |           |
        /        \             |           |
     Text      Comment     HTMLElement   HTMLDocument
                             /  |  \
                           /    |    \
                         /      |      \
                      div       p      li  ...
