import figlet from 'figlet'

const server = Bun.serve({
    port: 3000, //port de sortie
    fetch(req){
        const url = new URL(req.url)
        
        // routes depending on the pathname
        if(url.pathname== '/'){
            const body = figlet.textSync("Hello World!")
        return new Response(body)
        }
        if(url.pathname=== '/about'){
            return new Response("About me!")
        }
        if(url.pathname ==='/contact'){
            return new Response("Contact Us!")
        }
        if(url.pathname ==='/greet'){
            return new Response(Bun.file('./greet.txt'))
        }
        // handle Error
        if(url.pathname === "/feed"){
            throw new Error('Could not fetch feed')
        }
        return new Response(`404!`)
        
    },
    
    error(error){
        // in case of error, run this
        return new Response(`<pre> $(error) \n ${error.stack} </pre>`, {
            headers: {
                'Content-Type': 'text/html'
            }
        } )
    }
})

// use `` to substitute variables with $
console.log(`Listening on PORT http://localhost:${server.port}`)


