import { Elysia, t } from "elysia";
import { plugin } from "./plugin";
import { siginDTO } from "./models";
import { userModel } from "./usermodel";
console.log("Current directory:", process.cwd());

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [];
const userJSON = new URL("./users.json", import.meta.url);
// ✅ Fix Windows-style pathname
const usersFilePath = decodeURIComponent(
  userJSON.pathname.replace(/^\/([a-zA-Z]:\/)/, "$1") // removes extra `/` before C:/
);

// Load users from file on startup
async function loadUsersFromFile() {
  try {
    const data = await Bun.file(usersFilePath).text();
    users = JSON.parse(data) as User[];
  } catch (err){
    console.error("Could not read users.json:", err);
  }
}

// Save users to file
async function saveUsersToFile() {
  const jsonString = JSON.stringify(users, null, 2);
  await Bun.write(usersFilePath, jsonString);
}

const app = new Elysia().get("/", () => "Hello Bun, RESTFUL API")
.use(plugin)
.state({
  id:1,
  email: 'jane@gmail.com'
  })
.decorate('getDate', () => Date.now())
.get('/post/:id', ({params: {id}}) => {return {id: id, title:"Learn Bun"}} )
.post('/post', ({body, set, store}) => {
  console.log(store)
  set.status = 201
  return body
})
.get('/track/*', () => {return 'Track Route'}) //still needs "track/"
.get('/tracks', ({store, getDate}) => {
  //return new Response(JSON.stringify({
  //  "tracks": [
  //    'Dancing Feat',
  //    'Sam I',
  //    'Hello'
  //  ]
  //}), {
  //  headers: {
  //    'Content-Type': 'application/json'
  //  }
  //})
  console.log(store) //référence au .state
  console.log(getDate()) //appel à une fonction donc il faut utiliser les () pour l'executer
  console.log(store['plugin-version'])
  return {
    "tracks": [
      'Dancing Feat',
      'Sam I',
      'Hello'
    ]
  }
});


//version

// pas trop compris ce que le grouping fait...
app.group('/user', app => app
  .post('/sign-in', ({body}) => body, {
    //specify the authorised field of the body == schema
    body: siginDTO, 
    response: siginDTO
  })
  .post('/sign-up', () => 'Signup Route')
  .post('/profile', () => 'Profile Route')
  .get('/:id', () => 'User by id Route')
)

app.group('/v1', app => app
  .get('/', () => "Version 1")
  .group('/products', app => app
    .post('/', () => "Create Product")
    .get('/:id', ({params: {id}}) => {
      return id
    },
      {params: t.Object({
        id: t.Numeric()
      })
      }
        )
    .put('/:id', () => "UPDATE PRODUCT BY ID")
    .delete('/:id', () => "DELETE PRODUCT BY ID")
  )
)

app.group('/api', app => app
  .get('/users', () => {return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  }
  );
  })
  .post('/createuser', async ({body, set}) =>  {
    const userExists = users.some((u: any) => u.id === body.id); 

    if(userExists) {
      return new Response(JSON.stringify({"message": "the user already exists."}), {
        status: 300,
        headers: {
          "Content-Type": "application/json",
        },
      }
      )
    }
    
    //create the user
    users.push(body);

    await saveUsersToFile();
    console.log({"message": "The user was created successfully."});
    set.status = 201
    console.log(body)
    return new Response(JSON.stringify({"message": "The user was created successfully."}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
  , {body: userModel,}
  )
  .post("/updateuser", async ({body, set}) =>  {
    console.log("Bonjour");
    const userId = Number(body.id);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      set.status = 404;
      return { error: "User not found" };
    }

    //update the user
    users[index] = {
      ...users[index],
      ...body,
      id: userId, // Force ID consistency
    };

    await saveUsersToFile();
    console.log({"message": `The user ${userId} was updated successfully.`});
    set.status = 201
    console.log(body)
    return new Response(JSON.stringify({"message": `The user ${userId} was updated successfully.`}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
  , {body: userModel,}
  )
  .post("/deleteuser", async ({body, set}) =>  {
    const userId = Number(body.id);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      set.status = 404;
      return { error: "User not found" };
    }

    // Remove the user
    const removedUser = users.splice(index, 1)[0];

    await saveUsersToFile();
    console.log({"message": `The user ${userId} was deleted successfully.`});
    set.status = 201
    console.log(body)
    return new Response(JSON.stringify({"message": `The user ${userId} was deleted successfully.`}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

  }, {body: userModel,}
  )
  .delete('/clearusers', async ({ set }) => {
  users = []; // clear in-memory users

  await saveUsersToFile(); // write empty array to file

  set.status = 200;
  return new Response(
    JSON.stringify({ message: "All users have been deleted." }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  })
)

await loadUsersFromFile(); // Initialize users before server starts
app.listen(3000); //listening port

export { app };
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
