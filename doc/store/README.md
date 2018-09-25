# Store

Store itself has 1 significant branch (`entities`).
This branch stores all entities' state for application.
Every entity sets own state as 1st level children of this branch.

```
                   global-state
                     |       \
                   entities   other-branches
                  / /  |   \
        _________/ /   |    \_____________
       /          /    |                  \
entity1    entity2    feature1:entity3    feature2:entity4  
```


In generated entities' store, every small store has next structure:
```
               ==state== 
              /    |    \
    listLoading   keys   entities
```

`listLoading` - flag that is `true` is list is loading currently.
`keys` - list of keys of entities to display now.
`entities` - map with entities' data. Every entity is stored by its key (usually `String(id)`) and has next structure:
```
        entity
        /     \        
    data       meta
(main info)   / ||\\    
             / /  \\\__________________
          __/ /    \\_________         \
         /   /      \         \         \
  loading  saving  updatedAt  savedAt  existed  
```
