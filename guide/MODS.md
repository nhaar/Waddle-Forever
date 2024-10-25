# Using mods in Waddle Forever

As of version 0.2.0, mods are not **yet** officially supported, but they will be in a future version. There are two ways to use mods at the moment:

1. CPSC Mod Manager (Windows only, best option if you can)
2. Overriding the game files directly (Any platform, but not recommended!)

Here we will take a look at both approaches

# Game Files

In order to mod the game, you have to change the flash files of the game, which are present in the `media` folder, located in the game's directory.
We will not teach here all the details of the files but if you browse around in the files you will be able to find SWF files, which
you can replace with the ones from, for example, the CPArchives.

Not everything can be edited at the moment. Some modding features, like adding minigames, require some aditional setup which is not currently supported.

You can replace the SWF files directly, and if you do, the game will already receive the update. But, it is hard to keep track of your
mods like this (and they will be possibly lost if you update the game), so it is not fully recommended if you can use the CPSC Mod Manager

# CPSC Mod Manager

The CPSC Mod Manager is a simple to use program (only available for Windows). This is how you set it up:

Go to where your game is located (you can reach that by right clicking -> Open file location in the shorcut), and then you will find a folder called `media`:
![image](https://github.com/user-attachments/assets/61439925-034a-4aaa-9dce-574f9f538ef7)

This is the same folder the game files are in. Open the folder, and inside it, create a folder called `mods`:
![image](https://github.com/user-attachments/assets/056c5063-864f-48ff-8e5b-4ff04772d2ab)

Then, download the [CPSC Mod Manager file](https://waddleforever.com/CPSC%20Mod%20Manager.exe) (Credits to Olivercomet), and place it inside the `mods` folder you just created:
![image](https://github.com/user-attachments/assets/59663fe8-38a2-4e23-834e-ddc5927304e8)

That's it! You can already open the mod manager:
![image](https://github.com/user-attachments/assets/9479dcdd-6bfb-4948-a268-721288688173)

However, there are still no mods. Next we will show how to create mods

# Creating mods for the Mod Manager

The simplest way to understand the mod manager mods is to go through an example. [Download the example mod here](https://waddleforever.com/ExampleMod.zip). Extract the mod and place it inside the `mods` folder, this is how it should look like:
![image](https://github.com/user-attachments/assets/9c44e835-ffbb-4564-bcc7-ad07cd1ad5fa)

Now if you open the Mod Manager again, you will see the mod available:
![image](https://github.com/user-attachments/assets/37e9df74-33eb-4b76-a296-290026caf4ec)

By clicking on its name, you can see the details and even change them. By clicking on the checkbox, you will officialy enable the mod!
Now, go on Waddle Forever, and you will see it in effect...
![image](https://github.com/user-attachments/assets/3ee5e59e-436f-4111-96a4-2808204b2060)

Hooray! If the green puffle shows up, you have officially succeeded in adding a mod!

Now, if you open the mod folder, you can see how it works. There are many folders, starting with `static`, until you reach the file it contains
![image](https://github.com/user-attachments/assets/ae30a0bb-1624-4945-9ba8-1bab069ae459)

The reason for these folders is because this is how they are in the `media` folder:
![image](https://github.com/user-attachments/assets/f1d09b46-50b1-4e86-8271-4b2f17abefa2)

So, if you want to create mods, all you need to do is to make sure that the folder structure is the same in your mod folder.
You can go ahead and create new mods by creating a new folder inside `mods` and naming it whatever you want. Restart the mod manager and it should show up!
