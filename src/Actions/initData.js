export const initData = {
    boards: [
        {
            id: 'board-1',
            columnOrder: ['column-1', 'column-2', 'column-3'],
            columns: [
                {
                    id: 'column-1',
                    title: 'To do column',
                    boardId: 'board-1',
                    cardOrder: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7'],
                    cards: [
                        {
                            id: 'card-1',
                            title: 'Title of Card 1',
                            boardId: 'board-1',
                            columnId: 'column-1',
                            cover: 'https://trungquandev.com/wp-content/uploads/2021/06/mern-stack-trungquandev-youtube-thumnail-awesome-course.png'
                        },
                        { id: 'card-2', title: 'Title of Card 2', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-3', title: 'Title of Card 3', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-4', title: 'Title of Card 4', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-5', title: 'Title of Card 5', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-6', title: 'Title of Card 6', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-7', title: 'Title of Card 7', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-7', title: 'Title of Card 7', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-7', title: 'Title of Card 7', boardId: 'board-1', columnId: 'column-1', cover: null },
                        { id: 'card-7', title: 'Title of Card 7', boardId: 'board-1', columnId: 'column-1', cover: null }
                    ]
                },
                {
                    id: 'column-2',
                    title: 'In progress column',
                    boardId: 'board-1',
                    cardOrder: ['card-8', 'card-9', 'card-10'],
                    cards: [
                        {
                            id: 'card-8',
                            title: 'Title of Card 8',
                            boardId: 'board-1',
                            columnId: 'column-2',
                            cover: 'https://trungquandev.com/wp-content/uploads/2021/06/mern-stack-trungquandev-youtube-thumnail-awesome-course.png'
                        },
                        { id: 'card-9', title: 'Title of Card 9', boardId: 'board-1', columnId: 'column-2', cover: null },
                        { id: 'card-10', title: 'Title of Card 10', boardId: 'board-1', columnId: 'column-2', cover: null }
                    ]
                },
                {
                    id: 'column-3',
                    title: 'Done column',
                    boardId: 'board-1',
                    cardOrder: ['card-8', 'card-9', 'card-10'],
                    cards: [
                        { id: 'card-11', title: 'Title of Card 11', boardId: 'board-1', columnId: 'column-3', cover: null },
                        { id: 'card-12', title: 'Title of Card 12', boardId: 'board-1', columnId: 'column-3', cover: null },
                        { id: 'card-13', title: 'Title of Card 13', boardId: 'board-1', columnId: 'column-3', cover: null }
                    ]
                }
            ]
        }
    ]
};