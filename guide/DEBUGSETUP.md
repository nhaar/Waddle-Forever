Flash Player downloads: https://archive.org/details/flashplayerarchive

## Standalone Flash Player
For older versions of Club Penguin, standalone Flash Player should suffice. Versions before October 2006 do not work in debug Flash Player 23 or newer, so any older `sa_debug` build should work, for example [flashplayer10_3r183_25_win_sa_debug.exe](https://archive.org/download/flashplayerarchive/pub/flashplayer/installers/archive/fp_10.3.183.25_archive.zip/fp_10.3.183.25_archive%2F10.3.183.25.debug%2Fflashplayer10_3r183_25_win_sa_debug.exe).

In the Location box, enter `http://locahost:24105/load.swf` for pre-CPIP, or `http://locahost:24105/boots.swf` for post-CPIP.

## Browser plugin
Newer versions of Club Penguin can be impractical to run in standlone Flash Player and are better run in a browser. This can also be desirable to match the behaviour of the Electron client. Any Flash-enabled browser should suffice but this guide will use Chromium.

Old versions of Chromium can be found [here](https://vikyd.github.io/download-chromium-history-version/#/) (this site maps continuous builds to versions, all downloads are hosted by Google [here](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html)). Chromium 87 or lower is required, and 75 or lower is recommended as later versions make it more inconvenient to activate Flash. If using an older version of Flash as described above, you can also use command line option `--allow-outdated-plugins` when launching Chromium. [Direct link for Chromium 75 on Windows](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win_x64/645752/).

The Flash version is `winpep_debug`. If a newer version is already installed, the installer will block installation. To bypass this (on Windows) edit `HKEY_LOCAL_MACHINE\SOFTWARE\Macromedia\FlashPlayerPepper\Version` and `HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Macromedia\FlashPlayerPepper\Version`. [Direct link for flashplayer22_0r0_209_winpep_debug.exe](https://archive.org/download/flashplayerarchive/pub/flashplayer/installers/archive/fp_22.0.0.209_archive.zip/22_0_r0_209_debug%2Fflashplayer22_0r0_209_winpep_debug.exe).

## mm.cfg
For either the standalone or the plugin it is necessary to create a `mm.cfg` file to enabled logging. For standalone player see [here](https://web.archive.org/web/20210216051441/https://helpx.adobe.com/flash-player/kb/configure-debugger-version-flash-player.html).

For the Chromium plugin, the file should be in `AppData\Local\Chromium\User Data\Default\Pepper Data\Shockwave Flash\System\mm.cfg` and the log file will be in `AppData\Local\Chromium\User Data\Default\Pepper Data\Shockwave Flash\WritableRoot\Logs\flashlog.txt`.

There are many mm.cfg options but most are specific to AS3, which has some but limited use for Club Penguin. Sample file:

```
TraceOutputFileEnable=1 # Enables traces, should always be enabled
ErrorReportingEnable=1 # Should always be enabled 
TraceOutputBuffered=0 # Faster if enabled but may be more convenient disabled
AS3Verbose=1
AS3Trace=1 # Both of these options can be useful for newer content but are very log-heavy 
MaxWarnings=0 # 0 disables the warning limit. Set to a low number if you want to limit warnings
```

More documentation [here](https://jpauclair.net/2010/02/10/mmcfg-treasure/).
