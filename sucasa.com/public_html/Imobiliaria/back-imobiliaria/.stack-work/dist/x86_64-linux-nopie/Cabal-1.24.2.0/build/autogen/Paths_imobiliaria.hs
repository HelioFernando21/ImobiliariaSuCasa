{-# LANGUAGE CPP #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -fno-warn-implicit-prelude #-}
module Paths_imobiliaria (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,0,0] []
bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/bin"
libdir     = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/lib/x86_64-linux-ghc-8.0.2/imobiliaria-0.0.0-8b6W5vCle7QHueSmGaAKq9"
dynlibdir  = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/lib/x86_64-linux-ghc-8.0.2"
datadir    = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/share/x86_64-linux-ghc-8.0.2/imobiliaria-0.0.0"
libexecdir = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/libexec"
sysconfdir = "/var/www/sucasa.com/public_html/Imobiliaria/back-imobiliaria/.stack-work/install/x86_64-linux-nopie/lts-9.8/8.0.2/etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "imobiliaria_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "imobiliaria_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "imobiliaria_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "imobiliaria_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "imobiliaria_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "imobiliaria_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
