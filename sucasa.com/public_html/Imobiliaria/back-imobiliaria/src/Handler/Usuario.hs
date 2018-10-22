{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Usuario where

import Import
import Database.Persist.Postgresql
import Prelude (read)

postCadastraUsuR :: Handler Value
postCadastraUsuR = do
   usuarioNovo <- requireJsonBody :: Handler Usuario
   runDB $ insert usuarioNovo
   sendStatusJSON created201 (object ["resp" .= (String "Usuario cadastrado com sucesso.")])
