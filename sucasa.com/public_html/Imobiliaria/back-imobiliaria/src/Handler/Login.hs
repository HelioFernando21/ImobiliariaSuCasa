{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Login where

import Import
import Database.Persist.Postgresql
import Data.Aeson
import Prelude (read)

data Loginn = Loginn {email :: Text, senha :: Text} 

instance FromJSON Loginn where
    parseJSON = withObject "Loginn" $ \v -> Loginn
        <$> v .: "email"
        <*> v .: "senha"

-- login
postIniciarSessaoR :: Handler Value
postIniciarSessaoR = do
   login <- requireJsonBody :: Handler Loginn
   talvezUsuario <- runDB $ selectFirst [UsuarioEmail ==. email login
                                             ,UsuarioSenha ==. senha login] []
   case talvezUsuario of
      Just (Entity uid usr) -> do
         runDB $ update uid [UsuarioToken =. return (usuarioEmail usr)]
         sendStatusJSON ok200 (object ["resp" .= (uid , usuarioEmail usr, usuarioNome usr, usuarioToken usr)]) 
      Nothing -> sendStatusJSON status404 (object ["resp" .= (String "Usuário não cadastrado")])

-- logout
postFinalSessaoR :: UsuarioId -> Handler Value
postFinalSessaoR usuarioId = do
   runDB $ update usuarioId [UsuarioToken =. Nothing]
   sendStatusJSON noContent204 (emptyObject)
   
