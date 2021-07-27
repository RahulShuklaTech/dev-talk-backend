# Backend API for DevTalk

# Running instructions
Api will respond to requests at : URL:https://dev-talks-1.herokuapp.com 

# Endpoints 
    
    ## Auth Endpoints - /auth/
      -POST
        '/signup': 
          required: Name,Username,Password
          optional: Avatar photo
          response: returns user object.
        '/login':
          required: Username,Password
          response: token,refresh token, user id
        '/token':
          required: Refresh token
          response: token
    
    ## Post Endpoints - /post/
      -POST
        '/': Add a post  
          required: content and authorization header [Bearer <token>]
          response: returns post object.
        '/like':
          required: postID and authorization header [Bearer <token>]
          response: returns post object.
          
      -GET
        '/': Return all post of user and users in the following list
          required: authorization header
          response: Object conatinaing array of all posts with fields populated
        
        '/details/:postId
          required: postId as params
          response: returns single post with all fields
      
      -DELETE
        '/:postId':
          requierd: post id as param and auth header
          response: deleted post object.
          
    ## Follow Endpoints - /follow/
      -POST
        '/:follow': follow a user  
          required: username to follow as params and authorization header [Bearer <token>]
          response: returns user object.
                
      -GET
        '/': Return 5 follower suggestions requird auth headers
          required: authorization header
          response: Object conatinaing array of all users suggestions         
    
   ## profile Endpoints - /profile/          
     -GET
        '/:user': Return user profile object
          required: username as params and  authorization header
          response: User object conatinaing array of all fields with post populated
       
          
              

    