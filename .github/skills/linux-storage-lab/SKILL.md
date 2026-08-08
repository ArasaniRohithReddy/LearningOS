---
name: linux-storage-lab
description: "Hands-on Linux storage lab: list disks and partitions with lsblk, format and mount filesystems, make mounts persistent in /etc/fstab, measure usage with df and du, and grow volumes with LVM basics (PV/VG/LV). Use for 'Linux storage hands-on lab', 'disk/partition lab', 'mount a disk', 'disk full df/du', 'fstab', 'LVM basics', 'extend a volume', or learning Linux storage by doing."
argument-hint: "The storage need"
---

# Linux Storage Lab

A guided, hands-on lab on Linux storage — see the block devices, mount a filesystem, measure usage, and grow an
LVM volume — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`linux-command-coach`](../linux-command-coach/SKILL.md) and [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## When to use

- A disk is full, a new disk needs mounting, or a volume must grow — and the learner wants to do it safely.
- Teaching the stack from raw device → partition → filesystem → mount point → (optionally) LVM.

## Procedure

1. **Concept.** A **block device** is partitioned, a **filesystem** is created on a partition/LV, then **mounted**
   onto a directory; LVM adds PV → VG → LV so volumes can grow (`lsblk(8)`, `lvm(8)`).
2. **Survey.** `lsblk -f` shows devices, filesystems, and mount points; `blkid` shows UUIDs; `df -h` shows free
   space per mount and `df -i` free inodes.
3. **Find the hog.** `du -sh *` or `du -h --max-depth=1 /var | sort -h` locates what filled a full filesystem.
4. **Mount (exercise).** `sudo mkfs.ext4 /dev/sdX1` (⚠ formats!), then `sudo mount /dev/sdX1 /mnt`; for boot
   persistence add a **UUID** line to `/etc/fstab` and test with `sudo mount -a` before rebooting (fstab(5)).
5. **LVM basics.** `pvcreate /dev/sdX` → `vgcreate vg0 /dev/sdX` → `lvcreate -L 10G -n data vg0`; grow with
   `lvextend -L +5G /dev/vg0/data` then `resize2fs` (ext4) or `xfs_growfs` (xfs).
6. **Verify & pitfalls.** ⚠ `mkfs`, `fdisk`/`parted`, `pvremove`, `lvremove` destroy data — confirm the device in
   `lsblk` first, never operate on a mounted/system disk, and back up. Verify with `lsblk`, `df -h`, `pvs/vgs/lvs`.

## Output shape

```
Survey: lsblk -f ; blkid ; df -h ; df -i (inodes)
Hog: du -h --max-depth=1 /path | sort -h
Format+mount: mkfs.ext4 /dev/sdX1 → mount /dev/sdX1 /mnt   (⚠ mkfs wipes)
Persist: UUID=… in /etc/fstab → sudo mount -a  (test before reboot)
LVM: pvcreate → vgcreate → lvcreate ; grow: lvextend + resize2fs/xfs_growfs
⚠ Wrong device = data loss   Verify: lsblk ; df -h ; pvs/vgs/lvs
```

## Tips

- Identify the target device with `lsblk` immediately before `mkfs`/`parted` — `/dev/sda` vs `/dev/sdb` matters.
- Reference filesystems by **UUID** (not `/dev/sdX`, which can renumber); a bad `fstab` can block boot — `mount -a` first.
- End with the **Learning Footer** (`AGENTS.md`) — the device→fs→mount stack + an `lsblk`/`df -h`/`du` drill to run.
