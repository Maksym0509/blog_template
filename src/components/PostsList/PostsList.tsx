import { Flex, List, Text, Title } from '@mantine/core'
import { useHover, useMediaQuery } from '@mantine/hooks'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import useFormattedDate from '@/hooks/useFormattedDate'

import { PostFrontMatter } from '@/pages/blog'

import { useStyles } from './PostsList.styles'
import ViewCounter from '../ViewCounter'

const MotionNextLink = motion(Link)

type PostsListProps = {
  post: PostFrontMatter
}

const PostsList = (props: PostsListProps) => {
  const { post } = props
  const { locale } = useRouter()
  const { slug, date, title, summary, image } = post
  const { classes } = useStyles()
  const matches = useMediaQuery('(min-width: 940px)')
  const { hovered, ref } = useHover<HTMLAnchorElement>()
  const formattedDate = useFormattedDate(date, locale)

  const imageVariants: Variants = {
    initial: {
      boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      scale: 1,
    },
    hovered: {
      boxShadow: 'rgba(0, 0, 0, 0.1) 0 10px 20px 0',
      scale: 1.1,
    },
  }

  const articleVariants: Variants = {
    initial: {
      translateX: 1,
    },
    hovered: {
      translateX: 30,
    },
  }

  const listVariants: Variants = {
    offscreen: {
      y: 20,
    },
    onscreen: {
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  }

  return (
    <List.Item my={80} className={classes.item}>
      <MotionNextLink
        ref={ref}
        href={`/blog/${slug}`}
        className={classes.article}
        initial='offscreen'
        whileInView='onscreen'
        viewport={{ once: true, amount: 0.8 }}
        variants={listVariants}
      >
        <motion.div
          className={classes.imageContainer}
          animate={hovered && matches ? 'hovered' : 'initial'}
          variants={imageVariants}
          transition={{
            duration: 0.3,
          }}
        >
          <Image
            src={`/static/images/blog/${image}`}
            width={1280}
            height={720}
            placeholder='blur'
            blurDataURL={`/_next/image?url=/static/images/blog/${image}&w=16&q=1`}
            alt={`${title} cover`}
            className={classes.image}
          />
        </motion.div>
        <motion.div
          className={classes.content}
          animate={hovered && matches ? 'hovered' : 'initial'}
          variants={articleVariants}
          transition={{
            duration: 0.3,
          }}
        >
          <Flex gap={8} align='center' className={classes.info}>
            <Text>{formattedDate}</Text>
            {' - '}
            <ViewCounter slug={slug} text={false} type='GET' />
          </Flex>
          <Title order={2}>{title}</Title>
          <Text>{summary}</Text>
        </motion.div>
      </MotionNextLink>
    </List.Item>
  )
}

export default PostsList
