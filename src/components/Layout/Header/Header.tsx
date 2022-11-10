import { Burger, Group, Paper, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import Command from '@/components/Layout/Header/Command'
import HeaderLogo from '@/components/Layout/Header/HeaderLogo'
import LanguageSwitch from '@/components/Layout/Header/LanguageSwitch'
import { links } from '@/components/Layout/Header/links'
import ThemeSwitch from '@/components/Layout/Header/ThemeSwitch'

import { useStyles } from './Header.styles'

export default function Header() {
  const { classes, cx } = useStyles()
  const [opened, toggleOpened] = useDisclosure(false)
  const { pathname } = useRouter()

  const items = ({ animation }: { animation: boolean }) =>
    links.map(({ href, text }, index) => (
      <Link key={index} href={href} passHref>
        <motion.a
          className={cx(classes.link, {
            [classes.linkActive]: pathname === href,
          })}
          onClick={() => {
            toggleOpened.close()
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{
            x: animation ? '-100vw' : 0,
          }}
          animate={{
            x: 0,
          }}
        >
          {text}
        </motion.a>
      </Link>
    ))

  return (
    <div className={classes.header}>
      <div className={classes.headerLeft}>
        <Burger
          opened={opened}
          className={classes.burger}
          size='sm'
          onClick={() => toggleOpened.toggle()}
          aria-label='Toggle navbar'
        />
        <HeaderLogo />
        <Transition transition='slide-right' duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items({ animation: true })}
            </Paper>
          )}
        </Transition>
      </div>
      <div className={classes.headerRight}>
        <Group spacing={5} className={classes.links}>
          {items({ animation: false }).slice(0, 4)}
        </Group>
        <Command />
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
    </div>
  )
}
