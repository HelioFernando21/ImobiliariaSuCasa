{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE ViewPatterns #-}

module Foundation where

import Import.NoFoundation
import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Yesod.Core.Types     (Logger)
import Network.Wai as NW

data App = App
    { appSettings    :: AppSettings
    , appStatic      :: Static 
    , appConnPool    :: ConnectionPool 
    , appHttpManager :: Manager
    , appLogger      :: Logger
    }

mkYesodData "App" $(parseRoutesFile "config/routes")

instance Yesod App where
    makeLogger = return . appLogger

{-instance Yesod App where
    makeLogger = return . appLogger
    isAuthorized IniciarSessaoR _ = return Authorized
    --isAuthorized (MAnuncioR x) _ = ehUsuario' x -- Restringe que somente pessoas logadas possam ter acesso a essa rota
    isAuthorized (MAnuncioR _) _ = ehUsuario
    isAuthorized (CrudR _ y) _ = ehUsuario' y
    isAuthorized _ True = ehUsuario -- As demais rotas (com post) precisam (os usuarios) estar logados 
    isAuthorized _ _ = return Authorized

instance YesodAuth App where 
  type AuthId App = UsuarioId
  maybeAuthId = do 
     req <- waiRequest
     talvezHeader <- return $ lookup "authorization" (NW.requestHeaders req)
     case talvezHeader of
         Just _ -> do
             usr <- runDB $ selectFirst [UsuarioToken ==. (fmap decodeUtf8 talvezHeader)] []      
             case usr of
                Just x -> return . Just $ entityKey x
                Nothing -> return Nothing
         _ -> return Nothing

ehUsuario :: Handler AuthResult
ehUsuario = do 
    talvezUsuario <- maybeAuthId
    return $ case talvezUsuario of
      Just _ ->  Authorized
      Nothing ->  AuthenticationRequired

ehUsuario' :: UsuarioId -> Handler AuthResult
ehUsuario' uid = do 
    talvezUsuario <- maybeAuthId
    req <- waiRequest
    talvezHeader <- return $ lookup "authorization" (NW.requestHeaders req)
    case talvezUsuario of
        Just _ -> do
         usr <- runDB $ selectFirst [UsuarioToken ==. (fmap decodeUtf8 talvezHeader), UsuarioId ==. uid] []
         case usr of
            Just _ -> return Authorized
            Nothing -> return $ Unauthorized "Acesso negado."
        Nothing ->  return AuthenticationRequired-}

instance YesodPersist App where
    type YesodPersistBackend App = SqlBackend
    runDB action = do
        master <- getYesod
        runSqlPool action $ appConnPool master

instance RenderMessage App FormMessage where
    renderMessage _ _ = defaultFormMessage

instance HasHttpManager App where
    getHttpManager = appHttpManager
