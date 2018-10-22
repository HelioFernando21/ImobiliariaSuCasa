{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Estado where

import Import
import Database.Persist.Postgresql

getEstadoR :: Handler Value
getEstadoR = do
   estados <- runDB $ selectList [] [Asc EstadoNome]
   sendStatusJSON ok200 (object ["resp." .= estados])

